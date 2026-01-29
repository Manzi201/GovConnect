import React, { useState, useEffect, useCallback } from 'react';
import {
    Business as BusinessIcon,
    Folder as DepartmentIcon,
    LocationOn as LocationIcon,
    Chat as ChatIcon,
    Report as ReportIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { authAPI } from '../services/api';
import './OfficialsDirectoryPage.css';

export default function OfficialsDirectoryPage() {
    const [officials, setOfficials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        institution: '',
        department: '',
        serviceArea: '',
        location: ''
    });

    const handleSearch = useCallback(async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await authAPI.searchOfficials(filters);
            setOfficials(response.data.officials);
        } catch (error) {
            console.error('Failed to fetch officials', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        handleSearch();
    }, [handleSearch]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="directory-page cultural-bg">
            <div className="container">
                <header className="directory-header fade-in-up">
                    <h1>Discover Public Services</h1>
                    <p>Find the right official or department to assist you, based on service areas and institutions.</p>
                </header>

                <section className="search-filter-section glass">
                    <form onSubmit={handleSearch} className="filter-form">
                        <div className="filter-group">
                            <label>Institution</label>
                            <div className="input-with-icon">
                                <BusinessIcon className="input-icon" />
                                <input
                                    type="text"
                                    name="institution"
                                    placeholder="e.g. MINALOC, REG"
                                    value={filters.institution}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Department</label>
                            <div className="input-with-icon">
                                <DepartmentIcon className="input-icon" />
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="e.g. Finance, Public Works"
                                    value={filters.department}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Service Area</label>
                            <div className="input-with-icon">
                                <LocationIcon className="input-icon" />
                                <input
                                    type="text"
                                    name="serviceArea"
                                    placeholder="e.g. Water, Education"
                                    value={filters.serviceArea}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-premium btn-primary">
                            <SearchIcon style={{ marginRight: '8px' }} /> Search
                        </button>
                    </form>
                </section>

                <section className="officials-grid">
                    {loading ? (
                        <div className="loading-spinner">Searching officials...</div>
                    ) : (officials && officials.length > 0) ? (
                        officials.map(official => (
                            <div key={official.id} className="official-card glass">
                                <div className="official-avatar">
                                    {official.profilePhoto ? (
                                        <img src={official.profilePhoto} alt={official.name} />
                                    ) : (
                                        <div className="avatar-placeholder">{official.name.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="official-details">
                                    <h3>{official.name}</h3>
                                    <div className="designation">{official.designation || 'Government Officer'}</div>
                                    <div className="meta-info">
                                        <span><BusinessIcon fontSize="small" /> {official.institution}</span>
                                        <span><DepartmentIcon fontSize="small" /> {official.department}</span>
                                        <span><LocationIcon fontSize="small" /> {official.location}</span>
                                    </div>
                                    <div className="service-badge">{official.serviceArea}</div>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-premium btn-accent btn-sm" onClick={() => window.location.href = `/chat/${official.id}`}>
                                        <ChatIcon fontSize="small" style={{ marginRight: '5px' }} /> Chat
                                    </button>
                                    <button className="btn-premium btn-outline btn-sm" onClick={() => window.location.href = `/submit-complaint?officialId=${official.id}`}>
                                        <ReportIcon fontSize="small" style={{ marginRight: '5px' }} /> Report
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No officials found matching your criteria.</div>
                    )}
                </section>
            </div>
        </div>
    );
}
