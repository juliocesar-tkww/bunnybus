'use strict';

const EventEmitter = require('events').EventEmitter;
const Helpers = require('../helpers');
const Exceptions = require('../exceptions');

class Channel extends EventEmitter {

    constructor(name, connectionContext, channelOptions) {

        super();

        this._name = name;
        this._connectionContext = connectionContext;
        this._channelOptions = channelOptions;
        this._lock = false;
        this._channel = undefined;
    }

    get name() {

        return this._name;
    }

    get connetionContext() {

        return this._connectionContext;
    }

    get channelOptions() {

        return this._channelOptions;
    }

    get lock() {

        return this._lock;
    }

    set lock(value) {

        this._lock = value;
    }

    get channel() {

        return this._channel;
    }

    set channel(value) {

        this._channel = value;
    }
}

class ChannelManager extends EventEmitter {

    constructor() {

        super();

        this._channels = new Map();

        return this;
    }

    async create(name, connectionContext, channelOptions) {

        if (!connectionContext || !connectionContext.connection) {
            throw new Exceptions.NoConnectionError();
        }

        if (!channelOptions) {
            throw new Error('Expected channelOptions to be supplied');
        }

        const isNew = !this._channels.has(name);

        const channelContext = !isNew
            ? this._channels.get(name)
            : new Channel(name, connectionContext, channelOptions);

        if (channelContext.channel) {
            return channelContext;
        }

        if (isNew) {
            this._channels.set(name, channelContext);
        }

        if (channelContext.lock) {
            await new Promise((resolve) => {

                const intervalRef = setInterval(() => {

                    if (!channelContext.lock && channelContext.channel) {
                        clearInterval(intervalRef);
                        resolve();
                    }
                }, 200);
            });
        }
        else {
            await Helpers.retryAsync(
                async () => {

                    channelContext.lock = true;
                    channelContext.channel = await Helpers.timeoutAsync(connectionContext.connection.createConfirmChannel.bind(connectionContext.connection), channelOptions.timeout)();
                },
                Helpers.exponentialBackoff,
                channelOptions.connectionRetryCount
            );

            await channelContext.channel.prefetch(channelOptions.prefetch);

            channelContext.lock = false;
        }

        return channelContext;
    }

    contains(name) {

        return this._channels.has(name);
    }

    get(name) {

        return this._channels.get(name);
    }

    getChannel(name) {

        return this._channels.has(name)
            ? this._channels.get(name).channel
            : undefined;
    }

    async close(name) {

        if (this._channels.has(name)) {

            const channelContext = this._channels.get(name);

            if (channelContext.channel) {
                const oldChannel = channelContext.channel;
                channelContext.channel = undefined;
                await oldChannel.close();
            }
        }
    }
}

module.exports = ChannelManager;