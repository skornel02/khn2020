import React, {Component} from 'react';
import Timeline, { TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import * as Types from './resource/Types';
import Drupal from "./resource/Drupal";

interface State {
    locations: TimelineGroupBase[],
    events: TimelineItemBase<moment.Moment>[],
}

interface Props {

}

class Main extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            locations: [],
            events: [],
        };
    }

    componentDidMount() {
        Drupal.backend.getLocations()
            .then(gotLocations => {
                const locations = gotLocations.map((location, index) => {
                    return {
                        id: index + 1,
                        title: location.locationName
                    }
                });

                this.setState({locations});

                Drupal.backend.getScheduleEvent()
                    .then(gotScheduleEvents => {
                        const events = gotScheduleEvents.map(event => {
                            return {
                                id: event.id,
                                group: event.location,
                                start_time: moment(event.startDate + " " + event.startTime),
                                end_time: moment(event.startDate + " " + event.startTime).add(event.length, "hours"),
                                title: event.type,
                        }
                        });

                        this.setState({events});
                    })
            })
    }


    render() {
        return (
            <div>
                <Timeline
                    groups={this.state.locations}
                    items={this.state.events}
                    defaultTimeStart={moment().add(-12, 'hour')}
                    defaultTimeEnd={moment().add(12, 'hour')}
                />
            </div>
        );
    }
}

export default Main;