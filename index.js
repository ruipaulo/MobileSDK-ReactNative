import { NativeModules, Platform } from 'react-native'
import SelligentConstants from './constants'
import SelligentHelpers from './helpers'

const { RNSelligent } = NativeModules

// Check if Native version of Selligent found
SelligentHelpers.isNativeSelligentFound(RNSelligent)

// to export the android methods without syntax sugar and/or javascript manipulation, use this line:
// export default RNSelligent;

// platform specific code
var platformSpecificMethods = {}

if (Platform.OS === 'android') {
	platformSpecificMethods = require('./index.android.js').default
} else if (Platform.OS === 'ios') {
	platformSpecificMethods = require('./index.ios.js').default
}

// or export with syntax sugar and/or javascript manipulation:
export default Object.assign(
	{
		// Check if the Selligent Module is loaded
		_selligentLoaded: Boolean(RNSelligent),
		// Basic SMManager
		getVersionLib: function (successCallback) {
			RNSelligent.getVersionLib(successCallback)
			return
		},
		// DataTransaction

		// InAppMessage
		getInAppMessages: function (successCallback) {
			RNSelligent.getInAppMessages(successCallback)
			return
		},
		setInAppMessageAsSeen: function (successCallback, errorCallback, messageId) {
			// check if required options are valid
			if (!SelligentHelpers.typeMatches(messageId, 'string')) {
				errorCallback(SelligentHelpers.wrongArgumentError('Expected a string.'))
				return
			}
			
			// continue if options are valid
			const _successCallback = () => {
				successCallback(SelligentHelpers.SUCCESS)
			}

			RNSelligent.setInAppMessageAsSeen(messageId, _successCallback, errorCallback)
			return
		},
		executeButtonAction: function (successCallback, errorCallback, buttonId, messageId) {
			if (!SelligentHelpers.typeMatches(buttonId, 'string')) {
				errorCallback(SelligentHelpers.wrongArgumentError('Expected buttonId to be a string.'))
				return
			}
			if (!SelligentHelpers.typeMatches(messageId, 'string')) {
				errorCallback(SelligentHelpers.wrongArgumentError('Expected messageId to be a string.'))
				return
			}

			const _successCallback = () => {
				successCallback(SelligentHelpers.SUCCESS)
			}
			
			RNSelligent.executeButtonAction(buttonId, messageId, _successCallback, errorCallback)
			return
		},

		// Location
		enableGeolocation: function (successCallback, errorCallback, enabled) {
			// check if required options are valid
			if (!SelligentHelpers.typeMatches(enabled, 'boolean')) {
				errorCallback(SelligentHelpers.wrongArgumentError('Expected a boolean.'))
				return
			}

			// continue if options are valid
			successCallback(SelligentHelpers.SUCCESS)
			RNSelligent.enableGeolocation(enabled)
			return
		},
		isGeolocationEnabled: function (successCallback) {
			RNSelligent.isGeolocationEnabled(successCallback)
			return
		},
		// Event
		sendEvent: function (successCallback, errorCallback, event) {
			// check if required options are valid
			if (!SelligentHelpers.hasRequiredParameterAndMatchesType(event, 'type', 'number')) {
				errorCallback(SelligentHelpers.wrongArgumentError('Expected an object with the required key "type".'))
				return
			}

			// check which type is send
			// When type is `CUSTOM`
			if (event.type === SelligentConstants.EventType.CUSTOM) {
				// check if required options are valid
				if (!SelligentHelpers.hasRequiredParameterAndMatchesType(event, 'data', 'object')) {
					errorCallback(SelligentHelpers.wrongArgumentError('Expected an object with the key "data".'))
					return
				}

				// check if required options are valid
				if (event.hasOwnProperty('email')) {
					console.warn("Email prop is not used with \"custom\" event type and will be ignored.");
				}
			} else {
				if (!SelligentHelpers.hasRequiredParameterAndMatchesType(event, 'email', 'string')) {
					errorCallback(SelligentHelpers.wrongArgumentError('Expected an object with the key "email".'))
					return
				}
			}

			if (!SelligentHelpers.hasOptionalParameterAndMatchesType(event, 'shouldCache', 'boolean')) {
				errorCallback(SelligentHelpers.createTypeErrorMessage('shouldCache', event.shouldCache, 'boolean'))
				return
			}

			// continue if options are valid
			RNSelligent.sendEvent(event, successCallback, errorCallback)
			return
		},
		// Remote Notifications
		enableNotifications: function (successCallback, errorCallback, enabled) {
			// check if required options are valid
			if (!SelligentHelpers.typeMatches(enabled, 'boolean')) {
				errorCallback(SelligentHelpers.wrongArgumentError('Expected a boolean.'))
				return
			}

			// continue if options are valid
			successCallback(SelligentHelpers.SUCCESS)
			RNSelligent.enableNotifications(enabled)
			return
		},
		displayLastReceivedRemotePushNotification: function (successCallback) {
			successCallback(SelligentHelpers.SUCCESS)
			RNSelligent.displayLastReceivedRemotePushNotification()
			return
		},
		getLastRemotePushNotification: function (successCallback) {
			RNSelligent.getLastRemotePushNotification(successCallback)
			return
		}
	},
	{ ...platformSpecificMethods }
)
