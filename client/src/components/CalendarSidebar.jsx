import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const CalendarSidebar = ({ openModal, calendars, setPromptDeleteStatus, setDeletionId, setCalendarId }) => {
    const navigate = useNavigate();

    return (
        <div>
            <ul>
                <h1 className="hidden md:block text-2xl font-bold mb-4">Calendars</h1>
                <hr className="border-t border-gray-500 mb-4" />
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-200 w-full mb-4"
                    onClick={openModal}
                >
                    Create Calendar
                </button>
                <hr className="border-t border-gray-500 mb-4" />
                {calendars.map((item, idx) => {
                    return (
                        <li key={idx} className="p-2 hover:bg-gray-700 rounded hover:text-gray-300 group">
                            <div className="flex items-center justify-between">
                                <button
                                    id={item.id}
                                    className='text-left flex-1'
                                    onClick={() => {
                                        navigate('/calendar/' + item.id);
                                        setCalendarId(item.id);
                                    }}
                                >
                                    {item.name}
                                </button>

                                <div className="flex">
                                    <button
                                        onClick={() => {
                                            setPromptDeleteStatus(true);
                                            setDeletionId(item.id);
                                        }}
                                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-blue-500 hover:scale-110"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CalendarSidebar;
