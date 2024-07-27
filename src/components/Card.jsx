import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './card.css';
import Loading from './loading/Loading';

const Card = () => {
    const [retreats, setRetreats] = useState([]);
    const [filteredRetreats, setFilteredRetreats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typeFilter, setTypeFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 3;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    useEffect(() => {
        axios.get('https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats')
            .then(response => {
                setRetreats(response.data);
                setFilteredRetreats(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = retreats;

        if (typeFilter) {
            filtered = filtered.filter(retreat => retreat.type === typeFilter);
        }

        if (yearFilter) {
            filtered = filtered.filter(retreat => {
                const retreatYear = new Date(retreat.date * 1000).getFullYear();
                return retreatYear === parseInt(yearFilter);
            });
        }

        if (searchQuery) {
            filtered = filtered.filter(retreat =>
                retreat.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredRetreats(filtered);
        setCurrentPage(1);
    }, [typeFilter, yearFilter, searchQuery, retreats]);

    // Pagination Logic
    const indexOfLastCard = currentPage * itemsPerPage;
    const indexOfFirstCard = indexOfLastCard - itemsPerPage;
    const currentCards = filteredRetreats.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(filteredRetreats.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSearch = () => {
        // Trigger search by updating the filtered retreats based on searchQuery
        setSearchQuery(searchQuery);
    };

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <div className='card-head'>
                <div className="filter-section">
                    <label htmlFor="typeFilter">Type:</label>
                    <select
                        id="typeFilter"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Standalone">Standalone</option>
                        <option value="Signature">Signature</option>
                    </select>

                    <label htmlFor="yearFilter">Year:</label>
                    <select
                        id="yearFilter"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
                <div className='search-box'>
                    <input
                        type='text'
                        placeholder='Search by title'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="card-container">
                {currentCards.map(retreat => (
                    <div key={retreat.id} className="card">
                        <img src={retreat.image} alt={retreat.title} />
                        <h1>{retreat.title}</h1>
                        <p>{retreat.description}</p>
                        <p>Date: {formatDate(retreat.date)}</p>
                        <p>{retreat.location}</p>
                        <p>Price: ${retreat.price}</p>
                    </div>
                ))}
            </div>

            <div className="pagination-controls">
                <button onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default Card;
