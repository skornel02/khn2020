import React, {Component} from 'react';
import Timeline, { TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import Drupal from "./resource/Drupal";
import 'react-tiny-fab/dist/styles.css';

interface State {
    locations: TimelineGroupBase[] | undefined,
    events: TimelineItemBase<moment.Moment>[] | undefined
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
                        const events = gotScheduleEvents.map((event, index) => {
                            if (event.startDate === ""){
                                event.startDate = moment().format("YYYY-MM-DD")
                            }

                            return {
                                id: event.id,
                                group: event.location,
                                start_time: moment(event.startDate + " " + event.startTime),
                                end_time: moment(event.startDate + " " + event.startTime).add(event.length, "hour"),
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
        if (this.state.locations === undefined || this.state.events === undefined){
            return "Loading";
        }

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