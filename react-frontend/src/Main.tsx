import React, {Component} from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import Drupal from "./resource/Drupal";
import 'react-tiny-fab/dist/styles.css';
import {DrupalUser, EventLocation, EventRequest, Rule, ScheduleEvent, UserRole} from "./resource/Types";
import DailyTimeline from "./DailyTimeline";
import Menu from "./Menu";

interface State {
    locations: EventLocation[] | undefined,
    events: ScheduleEvent[] | undefined,
    requests: EventRequest[] | undefined,
    rules: Rule[] | undefined,
    users: DrupalUser[] | undefined,
    loggedInRole: UserRole | undefined
}

interface Props {

}

class Main extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            locations: undefined,
            events: undefined,
            requests: undefined,
            rules: undefined,
            users: undefined,
            loggedInRole: undefined
        };
    }

    componentDidMount() {
        Drupal.backend.getLocations()
            .then(locations => {
                this.setState({locations});
            });

        Drupal.backend.getScheduleEvent()
            .then(events => {
                this.setState({events});
            });

        Drupal.backend.getEventRequests()
            .then(requests => {
                this.setState({requests});
            });

        Drupal.backend.getRules()
            .then(rules => {
                this.setState({rules});
            });

        Drupal.backend.getUsers()
            .then(users => {
                users = users.filter(user => user.id !== 0);
                this.setState({users});

                this.setState({loggedInRole: users.find(user => user.username === Drupal.user?.username)?.role ?? UserRole.Anon});
            });
    }


    render() {
        if (this.state.locations === undefined
            || this.state.events === undefined
            || this.state.users === undefined
            || this.state.loggedInRole === undefined
            || this.state.requests === undefined
            || this.state.rules === undefined) {
            return "Loading";
        }

        return (
            <>
                <DailyTimeline locations={this.state.locations} events={this.state.events} users={this.state.users}/>
                <Menu/>
            </>
        );
    }
}

export default Main;