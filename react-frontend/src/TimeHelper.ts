import {DrupalUser, Rule, ScheduleEvent} from "./resource/Types";
import * as Moment from 'moment';
import {DateRange, extendMoment} from 'moment-range';

const moment = extendMoment(Moment);
const parser = require('cron-parser');

class TimeHelper {

    checkUserConflict(user: DrupalUser,
                      startTime: Moment.Moment,
                      length: Moment.Moment,
                      events: ScheduleEvent[],
                      rules: Rule[]): string[] | undefined {
        const errors: string[] = [];

        const toCreate: [Moment.Moment, Moment.Moment] = [startTime.clone(), startTime.clone()
            .add(length.hour(), 'hours')
            .add(length.minute(), 'minutes')];
        const toCreateRange = moment.range(toCreate);

        const existingOnes: DateRange[] = [];
        this.createRangesForEvents(events.filter(event => event.users.includes(user.id)))
            .forEach(range => existingOnes.push(range));
        this.createRangesForRules(rules.filter(rule => rule.users.includes(user.id)))
            .forEach(range => existingOnes.push(range));

        existingOnes.forEach(range => {
            if (range.overlaps(toCreateRange)) {
                console.log(range);
                errors.push("Ütközés: " + range.start.format("LLLL"))
            }
        });

        if (errors.length === 0) {
            return undefined;
        } else {
            return errors;
        }
    }

    createRangesForEvents(events: ScheduleEvent[]): DateRange[] {
        const existingOnes: DateRange[] = [];
        events.forEach(event => {
            if (event.repeatRule !== undefined && event.repeatRule.length !== 0 && event.repeatRule !== "0") {
                const forwardInterval = parser.parseExpression(event.repeatRule);
                const backwardsInterval = parser.parseExpression(event.repeatRule);
                for (let i = 0; i < 7; i++) {
                    const date = forwardInterval.next().toDate();
                    const eventRange: [Moment.Moment, Moment.Moment] = [moment(date), moment(date)
                        .add(event.length.hour(), 'hours')
                        .add(event.length.minute(), 'minutes')];
                    existingOnes.push(moment.range(eventRange));
                }
                for (let i = 0; i < 3; i++) {
                    const date = backwardsInterval.prev().toDate();
                    const eventRange: [Moment.Moment, Moment.Moment] = [moment(date), moment(date)
                        .add(event.length.hour(), 'hours')
                        .add(event.length.minute(), 'minutes')];
                    existingOnes.push(moment.range(eventRange));
                }
            } else {
                const eventRange: [Moment.Moment, Moment.Moment] = [event.startTimeDate, event.startTimeDate.clone()
                    .add(event.length.hour(), 'hours')
                    .add(event.length.minute(), 'minutes')];
                existingOnes.push(moment.range(eventRange));
            }
        });
        return existingOnes;
    }

    createRangesForRules(rules: Rule[]): DateRange[] {
        const existingOnes: DateRange[] = [];
        rules.forEach(event => {
            const forwardInterval = parser.parseExpression(event.repeatRule);
            const backwardsInterval = parser.parseExpression(event.repeatRule);
            for (let i = 0; i < 7; i++) {
                const date = forwardInterval.next().toDate();
                const eventRange: [Moment.Moment, Moment.Moment] = [moment(date), moment(date)
                    .add(event.length.hour(), 'hours')
                    .add(event.length.minute(), 'minutes')];
                existingOnes.push(moment.range(eventRange));
            }
            for (let i = 0; i < 3; i++) {
                const date = backwardsInterval.prev().toDate();
                const eventRange: [Moment.Moment, Moment.Moment] = [moment(date), moment(date)
                    .add(event.length.hour(), 'hours')
                    .add(event.length.minute(), 'minutes')];
                existingOnes.push(moment.range(eventRange));
            }
        });
        return existingOnes;
    }

}

export default new TimeHelper();