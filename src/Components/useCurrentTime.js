import moment from 'moment'
import { useRef, useState } from 'react'
import useInterval from './useInterval';

export default function useCurrentTime(refresh=1000) {
    const [time, setTime] = useState(moment());

    useInterval(() => {
        setTime(moment());
    }, refresh);

    return time;
}
