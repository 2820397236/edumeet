import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { Appear } from '../transitions';
import Peer from '../Containers/Peer';
import HiddenPeers from '../Containers/HiddenPeers';
import ResizeObserver from 'resize-observer-polyfill';

const RATIO = 1.334;

class Peers extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state = {
			peerWidth  : 400,
			peerHeight : 300
		};

		this.peersRef = React.createRef();
	}

	updateDimensions = debounce(() =>
	{
		if (!this.peersRef.current)
		{
			return;
		}

		const n = this.props.boxes;

		if (n === 0)
		{
			return;
		}

		const width = this.peersRef.current.clientWidth;
		const height = this.peersRef.current.clientHeight;

		let x, y, space;

		for (let rows = 1; rows < 100; rows = rows + 1)
		{
			x = width / Math.ceil(n / rows);
			y = x / RATIO;
			if (height < (y * rows))
			{
				y = height / rows;
				x = RATIO * y;
				break;
			}
			space = height - (y * (rows));
			if (space < y)
			{
				break;
			}
		}
		if (Math.ceil(this.state.peerWidth) !== Math.ceil(0.9 * x))
		{
			this.setState({
				peerWidth  : 0.9 * x,
				peerHeight : 0.9 * y
			});
		}
	}, 200);

	componentDidMount()
	{
		window.addEventListener('resize', this.updateDimensions);
		const observer = new ResizeObserver(this.updateDimensions);

		observer.observe(this.peersRef.current);
	}

	componentWillUnmount()
	{
		window.removeEventListener('resize', this.updateDimensions);
	}

	componentDidUpdate()
	{
		this.updateDimensions();
	}

	render()
	{
		const {
			advancedMode,
			activeSpeakerName,
			peers,
			spotlights,
			spotlightsLength
		} = this.props;

		const style =
		{
			'width'  : this.state.peerWidth,
			'height' : this.state.peerHeight
		};

		return (
			<div data-component='Peers' ref={this.peersRef}>
				{ Object.keys(peers).map((peerName) =>
				{
					if (spotlights.find((spotlightsElement) => spotlightsElement === peerName))
					{
						return (
							<Appear key={peerName} duration={1000}>
								<div
									className={classnames('peer-container', {
										'selected'       : this.props.selectedPeerName === peerName,
										'active-speaker' : peerName === activeSpeakerName
									})}
								>
									<div className='peer-content'>
										<Peer
											advancedMode={advancedMode}
											name={peerName}
											style={style}
										/>
									</div>
								</div>
							</Appear>
						);
					}
				})}
				<div className='hidden-peer-container'>
					<If condition={spotlightsLength < Object.keys(peers).length}>
						<HiddenPeers
							hiddenPeersCount={Object.keys(peers).length - spotlightsLength}
						/>
					</If>
				</div>
			</div>
		);
	}
}

Peers.propTypes =
	{
		advancedMode      : PropTypes.bool,
		peers             : PropTypes.object.isRequired,
		boxes             : PropTypes.number,
		activeSpeakerName : PropTypes.string,
		selectedPeerName  : PropTypes.string,
		spotlightsLength  : PropTypes.number,
		spotlights        : PropTypes.array.isRequired
	};

const mapStateToProps = (state) =>
{
	const spotlights = state.room.spotlights;
	const spotlightsLength = spotlights ? state.room.spotlights.length : 0;
	const boxes = spotlightsLength + Object.values(state.consumers)
		.filter((consumer) => consumer.source === 'screen').length;

	return {
		peers             : state.peers,
		boxes,
		activeSpeakerName : state.room.activeSpeakerName,
		selectedPeerName  : state.room.selectedPeerName,
		spotlights,
		spotlightsLength
	};
};

const PeersContainer = connect(
	mapStateToProps
)(Peers);

export default PeersContainer;
