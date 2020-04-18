import React, {Component} from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import Drupal from "./resource/Drupal";
import 'react-tiny-fab/dist/styles.css';
import {DrupalUser, EventLocation, EventRequest, Rule, ScheduleEvent, UserRole} from "./resource/Types";
import DailyTimeline from "./DailyTimeline";
import Menu from "./Menu";
import Requests from "./Requests";
import Users from "./Users";
import {AxiosError} from "axios";
import {
    Fab,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Backdrop,
    CircularProgress
} from '@material-ui/core';
import {Add, Help} from "@material-ui/icons";
import LocationModal from './LocationModal';

enum SelectedMenu {
    DailyTimeline,
    Requests,
    Users
}

enum OpenedModal {
    LocationCreator
}

interface State {
    locations: EventLocation[] | undefined,
    events: ScheduleEvent[] | undefined,
    requests: EventRequest[] | undefined,
    rules: Rule[] | undefined,
    users: DrupalUser[] | undefined,
    loggedInRole: UserRole | undefined,
    selectedMenu: SelectedMenu,
    openedModal: OpenedModal | undefined,
    isDrawerOpened: boolean
}

interface Props {
    logout: () => void
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
            selectedMenu: 0,
            openedModal: undefined,
            isDrawerOpened: false
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
            })
            .catch((err: AxiosError) => {
                this.setState({requests: []});
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
            })
            .catch((err: AxiosError) => {
                this.setState({users: []});
            });
    }

    toRequests = () => {

        this.setState({selectedMenu: SelectedMenu.Requests});
    };

    toMain = () => {
        this.setState({selectedMenu: SelectedMenu.DailyTimeline});
    };

    toUsers = () => {
        this.setState({selectedMenu: SelectedMenu.Users});
    };

    toLogin = () => {
        this.props.logout();
    }

    openDrawer = () => {
        this.setState({isDrawerOpened: true});
    }

    beginLocationCreation = () => {
        this.setState({openedModal: OpenedModal.LocationCreator})
    }

    render() {
        if (!this.state.locations
            || !this.state.events
            || !this.state.users
            || !this.state.loggedInRole
            || !this.state.requests
            || !this.state.rules) {
            return <Backdrop className="z-50" open>
                <CircularProgress color="inherit" />
            </Backdrop>;
        }

        let currentMenu = null;
        let currentModal = null;
        switch (this.state.selectedMenu) {
            case SelectedMenu.DailyTimeline:
                currentMenu = <DailyTimeline locations={this.state.locations} events={this.state.events}
                                             users={this.state.users}/>
                break;
            case SelectedMenu.Requests:
                currentMenu = <Requests requests={this.state.requests}/>
                break;
            case SelectedMenu.Users:
                currentMenu = <Users users={this.state.users}/>
                break;
        }

        switch (this.state.openedModal) {
            case OpenedModal.LocationCreator:
                currentModal = <LocationModal onClose={() => this.setState({openedModal: undefined})}/>
                break;
            default:
                currentModal = null;
        }

        const listItems = () => {
            let creatableComponents: string[] = [];

            switch (this.state.loggedInRole) {
                case UserRole.Parent:
                    creatableComponents = ["Event", "Location"];
                    return creatableComponents.map(comp => {
                        return <ListItem button key={comp} onClick={this.beginLocationCreation}>
                            <ListItemIcon><Help /></ListItemIcon>
                            <ListItemText primary={comp} />
                        </ListItem>;
                    });
            }
        }


        return (
            <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
                <div style={{flex: "1", maxHeight: "91vh"}}>
                    {currentMenu}
                    {currentModal}
                </div>
                <Fab color="primary" aria-label="add" onClick={this.openDrawer}>
                    <Add />
                </Fab>
                <Drawer anchor="bottom" open={this.state.isDrawerOpened} onClose={() => this.setState({isDrawerOpened: false})}>
                    <div
                        role="presentation"
                        onClick={() => this.setState({isDrawerOpened: false})}
                    >
                        <List>
                            {listItems()}
                        </List>
                    </div>
                </Drawer>
                <div style={{height: "9vh"}}>
                    <Menu toMain={this.toMain} toLogin={this.toLogin} toRequests={this.toRequests} toUsers={this.toUsers} userRole={this.state.loggedInRole}/>
                </div>
            </div>
        );
    }
}

export default Main;