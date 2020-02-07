'use strict';

module.exports = {
    PUBLISHED_EVENT: 'bunnybus.published',
    SUBSCRIBED_EVENT: 'bunnybus.subscribed',
    UNSUBSCRIBED_EVENT: 'bunnybus.unsubscribed',
    RECOVERING_EVENT: 'bunnybus.recovering',
    RECOVERED_EVENT: 'bunnybus.recovered',
    CONNECTION_MANAGER_REMOVED: 'connectionManager.removed',
    CHANNEL_MANAGER_REMOVED: 'channelManager.removed',
    AMQP_CONNECTION_ERROR_EVENT: 'amqp.connection.error',
    AMQP_CONNECTION_CLOSE_EVENT: 'amqp.connection.close',
    AMQP_CONNECTION_BLOCKED_EVENT: 'amqp.connection.blocked',
    AMQP_CONNECTION_UNBLOCKED_EVENT: 'amqp.connection.unblocked',
    AMQP_CHANNEL_ERROR_EVENT: 'amqp.channel.error',
    AMQP_CHANNEL_CLOSE_EVENT: 'amqp.channel.close',
    AMQP_CHANNEL_RETURN_EVENT: 'amqp.channel.return',
    AMQP_CHANNEL_DRAIN_EVENT: 'amqp.channel.drain'
};