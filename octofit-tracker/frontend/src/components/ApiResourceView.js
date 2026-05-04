import { useEffect, useMemo, useState } from 'react';
import { buildApiUrl, normalizeApiPayload } from './api';

function ApiResourceView({ resourceName, title, description }) {
  const endpoint = buildApiUrl(resourceName);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      console.log(`[${resourceName}] REST API endpoint:`, endpoint);
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const normalizedItems = normalizeApiPayload(payload);

        console.log(`[${resourceName}] fetched data:`, payload);
        console.log(`[${resourceName}] normalized items:`, normalizedItems);

        if (isMounted) {
          setItems(normalizedItems);
        }
      } catch (requestError) {
        console.error(`[${resourceName}] request error:`, requestError);
        if (isMounted) {
          setItems([]);
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [endpoint, resourceName]);

  const filteredItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return items;
    }

    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(normalizedSearchTerm)
    );
  }, [items, searchTerm]);

  const columns = useMemo(() => {
    const discoveredKeys = filteredItems.flatMap((item) => Object.keys(item || {}));
    return [...new Set(discoveredKeys)].slice(0, 5);
  }, [filteredItems]);

  const openDetails = (item) => {
    console.log(`[${resourceName}] selected item for modal:`, item);
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const renderCellValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-body-tertiary">-</span>;
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
      return (
        <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href={value} target="_blank" rel="noreferrer">
          Open link
        </a>
      );
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <div className="resource-view">
      <div className="data-view-header">
        <div>
          <h2 className="h2 mb-2">{title}</h2>
          <p className="text-secondary mb-0">{description}</p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-start justify-content-lg-end">
          <a
            className="btn btn-outline-primary btn-sm"
            href={endpoint}
            target="_blank"
            rel="noreferrer"
          >
            Open API endpoint
          </a>
          <span className="endpoint-badge">{endpoint}</span>
        </div>
      </div>

      <div className="card data-card border-0 shadow-sm">
        <div className="card-body p-3 p-lg-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
            <div>
              <h3 className="h4 mb-1">{title} dataset</h3>
              <p className="text-secondary mb-0">
                Consistent table layout with quick filtering and record details.
              </p>
            </div>
            <form className="row g-2 align-items-end data-toolbar" onSubmit={(event) => event.preventDefault()}>
              <div className="col-12 col-md-auto flex-grow-1">
                <label className="form-label small text-uppercase fw-semibold" htmlFor={`${resourceName}-filter`}>
                  Filter rows
                </label>
                <input
                  id={`${resourceName}-filter`}
                  className="form-control"
                  type="search"
                  placeholder={`Search ${title.toLowerCase()}`}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="col-12 col-md-auto">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => setSearchTerm('')}
                >
                  Reset filter
                </button>
              </div>
            </form>
          </div>

          {isLoading && <div className="alert alert-primary mb-0">Loading data from the REST API.</div>}

          {!isLoading && error && (
            <div className="alert alert-danger mb-0">Unable to load {title.toLowerCase()}: {error}</div>
          )}

          {!isLoading && !error && items.length === 0 && (
            <div className="alert alert-warning mb-0">The API returned no records for this resource.</div>
          )}

          {!isLoading && !error && items.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <span className="badge text-bg-light resource-badge">
                  Showing {filteredItems.length} of {items.length} records
                </span>
                <span className="text-secondary small">
                  Columns: {columns.length > 0 ? columns.join(', ') : 'No shared fields'}
                </span>
              </div>

              <div className="table-responsive resource-table-wrap">
                <table className="table table-hover align-middle resource-table mb-0">
                  <thead className="table-light">
                    <tr>
                      {columns.map((column) => (
                        <th key={column} scope="col" className="text-capitalize">
                          {column.replace(/_/g, ' ')}
                        </th>
                      ))}
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={item.id || `${resourceName}-${index}`}>
                        {columns.map((column) => (
                          <td key={`${item.id || index}-${column}`}>{renderCellValue(item[column])}</td>
                        ))}
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => openDetails(item)}
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredItems.length === 0 && (
                <div className="alert alert-info mt-3 mb-0">
                  No rows matched the current filter.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedItem && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header">
                  <div>
                    <h4 className="modal-title h4 mb-1">{title} details</h4>
                    <p className="text-secondary small mb-0">Full payload from the REST API response.</p>
                  </div>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeDetails} />
                </div>
                <div className="modal-body">
                  <div className="card border-0 bg-body-tertiary">
                    <div className="card-body">
                      <pre className="modal-json mb-0">{JSON.stringify(selectedItem, null, 2)}</pre>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeDetails}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeDetails} />
        </>
      )}
    </div>
  );
}

export default ApiResourceView;
