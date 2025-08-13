import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const InboxPage = () => {
  const [emails, setEmails] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate(); 
  
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const fetchEmails = async (pageNum, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/emails', { params: { page: pageNum, limit: 10, search } });
      setEmails(res.data.emails);
      setPageCount(res.data.pages);
      setTotalEmails(res.data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch emails');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails(page, searchText);
  }, [page, searchText]);

  const handlePrev = () => {
    if (page > 1) setSearchParams({ page: page - 1 });
  };
  const handleNext = () => {
    if (page < pageCount) setSearchParams({ page: page + 1 });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setSearchParams({ page: 1 }); // reset to page 1 on new search
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/');
    } catch (error) {
      alert('Failed to logout');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '2rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg style={{ width: '28px', height: '28px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>Inbox</h1>
              <p style={{
                color: '#bfdbfe',
                fontSize: '0.875rem',
                margin: 0
              }}>{totalEmails} emails</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {/* Search bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            position: 'relative',
            maxWidth: '600px'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '1rem',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search emails by subject or sender..."
              value={searchText}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        </div>

        {/* Loading and error states */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem 0'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <svg style={{ width: '24px', height: '24px', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={{ color: '#dc2626', fontWeight: '500', margin: 0 }}>{error}</p>
          </div>
        )}

        {!loading && emails.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 0'
          }}>
            <div style={{
              width: '96px',
              height: '96px',
              backgroundColor: '#f1f5f9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg style={{ width: '48px', height: '48px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p style={{ color: '#6b7280', fontSize: '1.125rem', margin: 0 }}>No emails found</p>
          </div>
        )}

        {/* Email list */}
        <div style={{ marginBottom: '2rem' }}>
          {emails.map((email) => (
            <Link key={email.id} to={`/mail/${email.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontWeight: '600',
                      color: '#1e293b',
                      fontSize: '1.125rem',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {email.subject || '(No Subject)'}
                    </h3>
                    <p style={{
                      color: '#4b5563',
                      margin: '0 0 0.5rem 0',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ fontWeight: '500' }}>From:</span> {email.from}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      <span>{new Date(email.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={handlePrev}
              disabled={page <= 1}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: '500',
                border: 'none',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                ...(page <= 1 
                  ? { backgroundColor: '#f1f5f9', color: '#9ca3af' }
                  : { 
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      color: 'white'
                    }
                )
              }}
              onMouseEnter={(e) => {
                if (page > 1) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (page > 1) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              Previous
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{
                color: '#374151',
                fontWeight: '500',
                margin: '0 0 0.25rem 0'
              }}>
                Page {page} of {pageCount}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                {totalEmails} total emails
              </p>
            </div>
            
            <button
              onClick={handleNext}
              disabled={page >= pageCount}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontWeight: '500',
                border: 'none',
                cursor: page >= pageCount ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                ...(page >= pageCount 
                  ? { backgroundColor: '#f1f5f9', color: '#9ca3af' }
                  : { 
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      color: 'white'
                    }
                )
              }}
              onMouseEnter={(e) => {
                if (page < pageCount) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (page < pageCount) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
