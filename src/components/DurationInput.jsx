import { useEffect, useRef, useState } from "react";
import styles from "./durationInput.module.css";

function DurationInput(props) {
    // const [duration, setDuration] = useState(0);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const onChange = props.onChange;

    useEffect(() => {
        // const value = days * 1440 + hours * 60 + minutes;
        // setDuration(value);
        onChange([days, hours, minutes]);
    }, [days, hours, minutes, onChange]);
    // const _setDays = (value) => { setDays(value); onChange([value, hours, minutes]) }
    // const _setHours = (value) => { setHours(value); onChange([days, value, minutes]) }
    // const _setMinutes = (value) => { setMinutes(value); onChange([days, hours, value]) }
    useEffect(() => {
        if (props.value !== [days, hours, minutes]) {
            setDays(props.value[0]);
            setHours(props.value[1]);
            setMinutes(props.value[2]);
        }
    }, [props.value]);

    return (
        <>
            {/* <div style={{ display: "none" }}>{duration} minutes</div> */}
            <div id={props.id} className={styles.StyledContainer}>
                <DurationTrack
                    numbers={[...Array(31).keys()]}
                    qualifier="day(s)"
                    onChange={value => setDays(value)}
                    num={days}
                />
                <DurationTrack
                    numbers={[...Array(24).keys()]}
                    qualifier="hour(s)"
                    onChange={value => setHours(value)}
                    num={hours}
                />
                <DurationTrack
                    numbers={[...Array(60).keys()]}
                    qualifier="min(s)"
                    onChange={value => setMinutes(value)}
                    num={minutes}
                />
            </div>
        </>
    );
}

const DurationTrack = ({ numbers, qualifier, border, onChange, num }) => {
    const list = useRef(null);
    const [value, setValue] = useState(0);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    let n = Number.parseFloat(entry.target.textContent)
                    onChange(n);
                    setValue(n)
                });
            },
            { threshold: 0.75 }
        );
        [...list.current.children].forEach(child => {
            //console.log("child", child);
            observer.observe(child);
        });
    }, []);

    const renderNumberJSX = () => {
        return numbers.map((number, i) => (
            <div className={styles.StyledNumber} key={qualifier + number}>{number}</div>
        ));
    };

    const [saveme, setSaveme] = useState(num);
    useEffect(() => {
        setValue(num);
        scroolTo(num);
        // console.log(`num: ${num}, value:${value}, save:${saveme}`);
        if (saveme !== num) {
            //the dom takes more time to render than useEffect call,
            //without the setTimeout it wont scroll to the value
            setTimeout(() => { setSaveme(num) }, 1000);
        }
    }, [num, saveme]);

    function scroolTo(v) {
        list.current.childNodes[v].scrollIntoView();
    }

    function durationScrollBy(delta) {
        let i = Math.max(delta + value, 0);
        i = Math.min(i, numbers.length - 1)
        list.current.childNodes[i].scrollIntoView();
        //console.log(list.current.childNodes);
    }

    return (
        <div className={styles.StyledTrack} border={border}>
            <div className={styles.StyledHeader}>{qualifier}</div>
            <div className={styles.StyledList} ref={list}>{renderNumberJSX()}</div>
            <div className={styles.buttonContainer}><button onClick={() => { durationScrollBy(1) }} type="button">+</button><button onClick={() => { durationScrollBy(-1) }} type="button">-</button></div>
        </div>
    );
};

export default DurationInput;