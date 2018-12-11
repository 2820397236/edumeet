import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as appPropTypes from './appPropTypes';
import * as requestActions from '../redux/requestActions';
import FullScreen from './FullScreen';

class Sidebar extends Component
{
	constructor(props)
	{
		super(props);

		this.fullscreen = new FullScreen(document);
		this.state = {
			fullscreen : false
		};
	}

	handleToggleFullscreen = () =>
	{
		if (this.fullscreen.fullscreenElement)
		{
			this.fullscreen.exitFullscreen();
		}
		else
		{
			this.fullscreen.requestFullscreen(document.documentElement);
		}
	};

	handleFullscreenChange = () =>
	{
		this.setState({
			fullscreen : this.fullscreen.fullscreenElement !== null
		});
	};

	componentDidMount()
	{
		if (this.fullscreen.fullscreenEnabled)
		{
			this.fullscreen.addEventListener('fullscreenchange', this.handleFullscreenChange);
		}
	}

	componentWillUnmount()
	{
		if (this.fullscreen.fullscreenEnabled)
		{
			this.fullscreen.removeEventListener('fullscreenchange', this.handleFullscreenChange);
		}
	}

	render()
	{
		const {
			toolbarsVisible, me, screenProducer, onLogin, onShareScreen,
			onUnShareScreen, onNeedExtension, onLeaveMeeting, onLogout, onToggleHand
		} = this.props;

		let screenState;
		let screenTip;

		if (me.needExtension)
		{
			screenState = 'need-extension';
			screenTip = 'Install screen sharing extension';
		}
		else if (!me.canShareScreen)
		{
			screenState = 'unsupported';
			screenTip = 'Screen sharing not supported';
		}
		else if (screenProducer)
		{
			screenState = 'on';
			screenTip = 'Stop screen sharing';
		}
		else
		{
			screenState = 'off';
			screenTip = 'Start screen sharing';
		}

		return (
			<div
				className={classnames('sidebar room-controls', {
					'visible' : toolbarsVisible
				})}
				data-component='Sidebar'
			>
				{this.fullscreen.fullscreenEnabled && (
					<div
						className={classnames('button', 'fullscreen', {
							on : this.state.fullscreen
						})}
						onClick={this.handleToggleFullscreen}
						data-tip='Fullscreen'
						data-place='right'
						data-type='dark'
					/>
				)}

				<div
					className={classnames('button', 'screen', screenState)}
					data-tip={screenTip}
					data-place='right'
					data-type='dark'
					onClick={() =>
					{
						switch (screenState)
						{
							case 'on':
							{
								onUnShareScreen();
								break;
							}
							case 'off':
							{
								onShareScreen();
								break;
							}
							case 'need-extension':
							{
								onNeedExtension();
								break;
							}
							default:
							{
								break;
							}
						}
					}}
				/>

				{me.loginEnabled && (me.loggedIn ? (
					<div
						className='button logout'
						data-tip='Logout'
						data-place='right'
						data-type='dark'
						onClick={onLogout}
					>
						<img src={me.picture || 'resources/images/avatar-empty.jpeg'} />
					</div>
				) : (
					<div
						className='button login off'
						data-tip='Login'
						data-place='right'
						data-type='dark'
						onClick={onLogin}
					/>
				))}
				<div
					className={classnames('button', 'raise-hand', {
						on       : me.raiseHand,
						disabled : me.raiseHandInProgress
					})}
					data-tip='Raise hand'
					data-place='right'
					data-type='dark'
					onClick={() => onToggleHand(!me.raiseHand)}
				/>

				<div
					className={classnames('button', 'leave-meeting')}
					data-tip='Leave meeting'
					data-place='right'
					data-type='dark'
					onClick={() => onLeaveMeeting()}
				/>
			</div>
		);
	}
}

Sidebar.propTypes = {
	toolbarsVisible : PropTypes.bool.isRequired,
	me              : appPropTypes.Me.isRequired,
	onShareScreen   : PropTypes.func.isRequired,
	onUnShareScreen : PropTypes.func.isRequired,
	onNeedExtension : PropTypes.func.isRequired,
	onToggleHand    : PropTypes.func.isRequired,
	onLeaveMeeting  : PropTypes.func.isRequired,
	onLogin         : PropTypes.func.isRequired,
	onLogout        : PropTypes.func.isRequired,
	screenProducer  : appPropTypes.Producer
};

const mapStateToProps = (state) =>
	({
		toolbarsVisible : state.room.toolbarsVisible,
		screenProducer  : Object.values(state.producers)
			.find((producer) => producer.source === 'screen'),
		me : state.me
	});

const mapDispatchToProps = {
	onLeaveMeeting  : requestActions.leaveRoom,
	onShareScreen   : requestActions.enableScreenSharing,
	onUnShareScreen : requestActions.disableScreenSharing,
	onNeedExtension : requestActions.installExtension,
	onToggleHand    : requestActions.toggleHand,
	onLogin         : requestActions.userLogin,
	onLogout        : requestActions.userLogout
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Sidebar);
