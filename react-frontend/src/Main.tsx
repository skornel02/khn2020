import React, {Component} from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import Drupal from "./resource/Drupal";
import 'react-tiny-fab/dist/styles.css';
import {DrupalUser, EventLocation, EventRequest, Rule, ScheduleEvent, UserRole} from "./resource/Types";
import DailyTimeline from "./DailyTimeline";
import Menu from "./Menu";
import RequestsModal from "./RequestsModal";

interface State {
    locations: EventLocation[] | undefined,
    events: ScheduleEvent[] | undefined,
    requests: EventRequest[] | undefined,
    rules: Rule[] | undefined,
    users: DrupalUser[] | undefined,
    loggedInRole: UserRole | undefined,
    currentView: any
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
            loggedInRole: undefined,
            currentView: undefined
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
                this.setState({users});

                this.setState({loggedInRole: users.find(user => user.username === Drupal.user?.username)?.role ?? UserRole.Anon});
            });
    }

    toRequests = () => {
        this.setState({currentView: <RequestsModal onClose={this.closeRequests} requests={this.state.requests}/>});
    }

    closeRequests = () => {
        this.setState({currentView: null});
    }

    render() {
        if (!this.state.locations
            || !this.state.events
            || !this.state.users
            || !this.state.loggedInRole
            || !this.state.requests
            || !this.state.rules) {
            return "Loading";
        }

        return (
            <>
                <DailyTimeline locations={this.state.locations} events={this.state.events} users={this.state.users}/>
                {this.state.currentView}
                <Menu toRequests={this.toRequests} userRole={this.state.loggedInRole}/>
            </>
        );
    }
}

export default Main;