import {DrupalUser, ScheduleEvent} from "./resource/Types";
import moment from "moment";

class TimeHelper {

    checkUserConflict(events: ScheduleEvent[], user: DrupalUser, startTime: moment.Moment, length: moment.Moment): string | undefined {
        return undefined;
    }

}

export default new TimeHelper();