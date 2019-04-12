const initialState =
{
	url                : null,
	state              : 'new', // new/connecting/connected/disconnected/closed,
	locked             : false,
	lockedOut          : false,
	audioSuspended     : false,
	activeSpeakerName  : null,
	torrentSupport     : false,
	showSettings       : false,
	fullScreenConsumer : null, // ConsumerID
	windowConsumer     : null, // ConsumerID
	toolbarsVisible    : true,
	mode               : 'democratic',
	selectedPeerName   : null,
	spotlights         : [],
	settingsOpen       : false
};

const room = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'SET_ROOM_URL':
		{
			const { url } = action.payload;

			return { ...state, url };
		}

		case 'SET_ROOM_STATE':
		{
			const roomState = action.payload.state;

			if (roomState === 'connected')
				return { ...state, state: roomState };
			else
				return { ...state, state: roomState, activeSpeakerName: null };
		}

		case 'SET_ROOM_LOCKED':
		{
			return { ...state, locked: true };
		}

		case 'SET_ROOM_UNLOCKED':
		{
			return { ...state, locked: false };
		}

		case 'SET_ROOM_LOCKED_OUT':
		{
			return { ...state, lockedOut: true };
		}

		case 'SET_AUDIO_SUSPENDED':
		{
			const { audioSuspended } = action.payload;

			return { ...state, audioSuspended };
		}

		case 'SET_SETTINGS_OPEN':
		{
			const { settingsOpen } = action.payload;

			return { ...state, settingsOpen };
		}

		case 'SET_ROOM_ACTIVE_SPEAKER':
		{
			const { peerName } = action.payload;

			return { ...state, activeSpeakerName: peerName };
		}

		case 'FILE_SHARING_SUPPORTED':
		{
			const { supported } = action.payload;

			return { ...state, torrentSupport: supported };
		}

		case 'TOGGLE_SETTINGS':
		{
			const showSettings = !state.showSettings;

			return { ...state, showSettings };
		}

		case 'TOGGLE_FULLSCREEN_CONSUMER':
		{
			const { consumerId } = action.payload;
			const currentConsumer = state.fullScreenConsumer;

			return { ...state, fullScreenConsumer: currentConsumer ? null : consumerId };
		}

		case 'TOGGLE_WINDOW_CONSUMER':
		{
			const { consumerId } = action.payload;
			const currentConsumer = state.windowConsumer;

			if (currentConsumer === consumerId)
				return { ...state, windowConsumer: null };
			else
				return { ...state, windowConsumer: consumerId };
		}

		case 'SET_TOOLBARS_VISIBLE':
		{
			const { toolbarsVisible } = action.payload;

			return { ...state, toolbarsVisible };
		}

		case 'SET_DISPLAY_MODE':
			return { ...state, mode: action.payload.mode };

		case 'SET_SELECTED_PEER':
		{
			const { selectedPeerName } = action.payload;

			return {
				...state,

				selectedPeerName : state.selectedPeerName === selectedPeerName ?
					null : selectedPeerName
			};
		}

		case 'SET_SPOTLIGHTS':
		{
			const { spotlights } = action.payload;

			return { ...state, spotlights };
		}

		default:
			return state;
	}
};

export default room;
