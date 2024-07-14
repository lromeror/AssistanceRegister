import './Styles/Card.css';
import { BsDatabaseFillAdd,BsDatabaseFillCheck  } from "react-icons/bs";

export default function Card({ id, onClick }) {
    return(
        <div className="card" onClick={onClick}>
            <div>
                {id == 1 ? <BsDatabaseFillAdd size={50}/> : <BsDatabaseFillCheck size={50}/>}
            </div>
            <div className='text_card'>
                {id == 1 ? <p>NEW DATA</p> : <p>DATA</p> }
            </div>
        </div>
    )
}