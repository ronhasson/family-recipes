import { useEffect, useRef, useState } from "react";
import styles from "./durationInput.module.css";

function DurationInput(props) {
    const [duration, setDuration] = useState(0);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        const value = days * 1440 + hours * 60 + minutes;
        setDuration(value);
    }, [days, hours, minutes]);

    return (
        <>
            <div style={{ display: "none" }}>{duration} minutes</div>
            <div id={props.id} className={styles.StyledContainer}>
                <DurationTrack
                    numbers={[...Array(31).keys()]}
                    qualifier="day(s)"
                    onChange={value => setDays(value)}
                />
                <DurationTrack
                    numbers={[...Array(24).keys()]}
                    qualifier="hour(s)"
                    onChange={value => setHours(value)}
                />
                <DurationTrack
                    numbers={[...Array(60).keys()]}
                    qualifier="min(s)"
                    onChange={value => setMinutes(value)}
                />
            </div>
        </>
    );
}

const DurationTrack = ({ numbers, qualifier, border, onChange }) => {
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