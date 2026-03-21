import useCountUp from '../../model/use-count-up';

export default function CountUp({end}:{end: number}) {

    const count = useCountUp(end, {duration: 4000} );

    return count;
}
