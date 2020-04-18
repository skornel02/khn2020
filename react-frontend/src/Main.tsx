import React, {Component} from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import Drupal from "./resource/Drupal";
import 'react-tiny-fab/dist/styles.css';
import {DrupalUser, EventLocation, EventRequest, Rule, ScheduleEvent, UserRole} from "./resource/Types";
import DailyTimeline from "./DailyTimeline";
import Menu from "./Menu";
import Requests from "./Requests";

enum SelectedMenu {
    DailyTimeline,
    Requests,
}

interface State {
    locations: EventLocation[] | undefined,
    events: ScheduleEvent[] | undefined,
    requests: EventRequest[] | undefined,
    rules: Rule[] | undefined,
    users: DrupalUser[] | undefined,
    loggedInRole: UserRole | undefined,
    selectedMenu: SelectedMenu
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
            selectedMenu: 0
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

    toRequests = () => {

        this.setState({selectedMenu: SelectedMenu.Requests});
    };

    toMain = () => {
        this.setState({selectedMenu: SelectedMenu.DailyTimeline});
    };

    render() {
        if (!this.state.locations
            || !this.state.events
            || !this.state.users
            || !this.state.loggedInRole
            || !this.state.requests
            || !this.state.rules) {
            return "Loading";
        }

        let currentMenu = null;
        switch (this.state.selectedMenu) {
            case SelectedMenu.DailyTimeline:
                currentMenu = <DailyTimeline locations={this.state.locations} events={this.state.events}
                                             users={this.state.users}/>
                break;
            case SelectedMenu.Requests:
                currentMenu = <Requests requests={this.state.requests}/>
                break;
        }

        return (
            <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
                <div style={{flex: "1", maxHeight: "91vh"}}>
                    {currentMenu}
                </div>
                <div style={{height: "9vh"}}>
                    <Menu toMain={this.toMain} toRequests={this.toRequests} userRole={this.state.loggedInRole}/>
                </div>
            </div>
        );
    }
}

export default Main;