import React, {Component} from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';

const groups = [{id: 1, title: 'group 1'}, {id: 2, title: 'group 2'}]

const items = [
    {
        id: 1,
        group: 1,
        title: 'item 1',
        start_time: moment(),
        end_time: moment().add(1, 'hour')
    },
    {
        id: 2,
        group: 2,
        title: 'item 2',
        start_time: moment().add(-0.5, 'hour'),
        end_time: moment().add(0.5, 'hour'),
        canMove: true
    },
    {
        id: 3,
        group: 1,
        title: 'item 3',
        start_time: moment().add(2, 'hour'),
        end_time: moment().add(3, 'hour')
    }
]


class Main extends Component {
    render() {
        return (
            <div>
                <Timeline
                    groups={groups}
                    items={items}
                    visibleTimeStart={moment().add(-12, 'hour')}
                    visibleTimeEnd={moment().add(12, 'hour')}
                />
            </div>
        );
    }
}

export default Main;