//
//  PushNotification.js
//
// Based on the Push Notifications Cordova Plugin by Olivier Louvignes on 06/05/12.
// Modified by Max Konev on 18/05/12.
//
// Pushwoosh Push Notifications Plugin for Cordova iOS
// www.pushwoosh.com
//
// MIT Licensed

(function(cordova) {

  function PushNotification() {
    notifications: 0
  }

  // Call this to register for push notifications and retreive a deviceToken
  PushNotification.prototype.registerDevice = function(config, success, fail) {
    cordova.exec(success, fail, "PushNotification", "registerDevice", config ? [config] : []);
  };

  //Android Only----
  PushNotification.prototype.unregisterDevice = function(success, fail) {
    cordova.exec(success, fail, "PushNotification", "unregisterDevice", []);
  };
  //Android End----

  //iOS only----
  PushNotification.prototype.onDeviceReady = function() {
    cordova.exec(null, null, "PushNotification", "onDeviceReady", []);
  };

  // Call this to get a detailed status of remoteNotifications
  PushNotification.prototype.getRemoteNotificationStatus = function(callback) {
    cordova.exec(callback, callback, "PushNotification", "getRemoteNotificationStatus", []);
  };

  // Call this to set the application icon badge
  PushNotification.prototype.setApplicationIconBadgeNumber = function(badge, callback) {
    this.notifications = 0;
    // alert("setting badge number to "+badge);
    cordova.exec(callback, callback, "PushNotification", "setApplicationIconBadgeNumber", [{badge: badge}]);
  };

  // Call this to clear all notifications from the notification center
  PushNotification.prototype.cancelAllLocalNotifications = function(callback) {
    cordova.exec(callback, callback, "PushNotification", "cancelAllLocalNotifications", []);
  };
  //iOS End----

  // Event spawned when a notification is received while the application is active
  PushNotification.prototype.notificationCallback = function(notification) {
    var ev = document.createEvent('HTMLEvents');
    ev.notification = notification;
    ev.initEvent('push-notification', true, true, arguments);
    document.dispatchEvent(ev);
  };

  cordova.addConstructor(function() {
    if(!window.plugins) window.plugins = {};
    window.plugins.pushNotification = new PushNotification();
  });

})(window.cordova || window.Cordova || window.PhoneGap);

function initPushwoosh()
{
  
  var pushNotification = window.plugins.pushNotification;
  
  pushNotification.onDeviceReady();

  pushNotification.registerDevice({alert:true, badge:true, sound:true, appid:"67C93-A6F03", appname:"snapshot"},
  function(status) {
    var deviceToken = status['deviceToken'];
    console.warn('registerDevice: ' + deviceToken);
  },
  function(status) {
    console.warn('failed to register : ' + JSON.stringify(status));
    navigator.notification.alert(JSON.stringify(['failed to register ', status]));
  });

  pushNotification.setApplicationIconBadgeNumber(0);

  document.addEventListener('push-notification', function(event) {
    var notification = event.notification;
    navigator.notification.alert(notification.aps.alert);
    pushNotification.notifications++;
    pushNotification.setApplicationIconBadgeNumber(3);
  });
}
