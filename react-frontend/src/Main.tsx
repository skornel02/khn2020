import React, {Component} from 'react';
import Timeline, {TimelineGroupBase, TimelineItemBase} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import Drupal from "./resource/Drupal";
import 'react-tiny-fab/dist/styles.css';
import {EventLocation, ScheduleEvent} from "./resource/Types";
import DailyTimeline from "./DailyTimeline";

interface State {
    locations: EventLocation[] | undefined,
    events: ScheduleEvent[] | undefined
}

interface Props {

}

class Main extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            locations: undefined,
            events: undefined
        };
    }

    componentDidMount() {
        Drupal.backend.getLocations()
            .then(locations => {
                this.setState({locations});

                Drupal.backend.getScheduleEvent()
                    .then(gotScheduleEvents => {
                        const events = gotScheduleEvents.map((event, index) => {
                            return {
                                id: event.id,
                                group: event.location,
                                start_time: event.startTimeDate,
                                end_time: moment(event.startTimeDate).add(event.length.hours(), "hour")
                                    .add(event.length.minutes(), "minutes")
                                    .add(event.length.minutes(), "seconds"),
                                title: event.type,
                                canMove: false,
                                canResize: false,
                                canChangeGroup: false,
                        }
                        });
                        this.setState({events});
                    })
            })
    }


    render() {
        if (this.state.locations === undefined || this.state.events === undefined) {
            return "Loading";
        }

        return (
            <DailyTimeline locations={this.state.locations} events={this.state.events}/>
        );
    }
    }

    export default Main;