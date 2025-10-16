import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = window.location.origin;

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [containers, setContainers] = useState([]);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTemplates();
    fetchContainers();
    fetchBackups();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/templates`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
    setLoading(false);
  };

  const fetchContainers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/containers`);
      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error('Error fetching containers:', error);
    }
  };

  const fetchBackups = async () => {
    try {
      const response = await fetch(`${API_URL}/api/backups`);
      const data = await response.json();
      setBackups(data);
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const handleDeleteTemplate = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/templates/${filename}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Template deleted successfully');
        fetchTemplates();
        fetchStats();
      } else {
        alert('Error deleting template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error deleting template');
    }
  };

  const handleCleanupTemplates = async (dryRun = true) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/templates/cleanup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dry_run: dryRun })
      });
      
      const data = await response.json();
      
      if (dryRun) {
        const unusedCount = data.unused_templates.length;
        if (unusedCount > 0) {
          if (window.confirm(`Found ${unusedCount} unused templates. Delete them?`)) {
            handleCleanupTemplates(false);
          }
        } else {
          alert('No unused templates found!');
        }
      } else {
        alert(`Deleted ${data.count} unused templates`);
        fetchTemplates();
        fetchStats();
      }
    } catch (error) {
      console.error('Error cleaning up templates:', error);
      alert('Error cleaning up templates');
    }
    setLoading(false);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/backups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Backup created: ${data.backup_name}`);
        fetchBackups();
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error creating backup');
    }
    setLoading(false);
  };

  const handleDeleteBackup = async (backupName) => {
    if (!window.confirm(`Delete backup ${backupName}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/backups/${backupName}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Backup deleted');
        fetchBackups();
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Error deleting backup');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const toggleTemplateSelection = (filename) => {
    setSelectedTemplates(prev => 
      prev.includes(filename) 
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedTemplates.length === 0) {
      alert('No templates selected');
      return;
    }

    if (!window.confirm(`Delete ${selectedTemplates.length} selected templates?`)) {
      return;
    }

    setLoading(true);
    for (const filename of selectedTemplates) {
      try {
        await fetch(`${API_URL}/api/templates/${filename}`, { method: 'DELETE' });
      } catch (error) {
        console.error(`Error deleting ${filename}:`, error);
      }
    }
    setSelectedTemplates([]);
    fetchTemplates();
    fetchStats();
    setLoading(false);
    alert(`Deleted ${selectedTemplates.length} templates`);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🐳 Docker Template Manager</h1>
        <p>Manage Unraid Docker Templates</p>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'templates' ? 'active' : ''} 
          onClick={() => setActiveTab('templates')}
        >
          📄 Templates
        </button>
        <button 
          className={activeTab === 'containers' ? 'active' : ''} 
          onClick={() => setActiveTab('containers')}
        >
          📦 Containers
        </button>
        <button 
          className={activeTab === 'backups' ? 'active' : ''} 
          onClick={() => setActiveTab('backups')}
        >
          💾 Backups
        </button>
      </nav>

      <main className="content">
        {activeTab === 'dashboard' && stats && (
          <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Templates</h3>
                <div className="stat-value">{stats.total_templates}</div>
                <div className="stat-detail">
                  {stats.matched_templates} matched, {stats.unmatched_templates} unused
                </div>
              </div>
              <div className="stat-card">
                <h3>Containers</h3>
                <div className="stat-value">{stats.total_containers}</div>
                <div className="stat-detail">
                  {stats.running_containers} running
                </div>
              </div>
              <div className="stat-card">
                <h3>Backups</h3>
                <div className="stat-value">{stats.total_backups}</div>
              </div>
            </div>

            {stats.unmatched_templates > 0 && (
              <div className="alert alert-warning">
                <strong>⚠️ {stats.unmatched_templates} unused templates detected</strong>
                <button onClick={() => handleCleanupTemplates(true)} disabled={loading}>
                  Clean Up Unused Templates
                </button>
              </div>
            )}

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <button onClick={() => handleCreateBackup()} disabled={loading}>
                💾 Create Backup
              </button>
              <button onClick={() => fetchStats()}>
                🔄 Refresh Stats
              </button>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates">
            <div className="section-header">
              <h2>Templates ({templates.length})</h2>
              <div className="actions">
                {selectedTemplates.length > 0 && (
                  <>
                    <span>{selectedTemplates.length} selected</span>
                    <button onClick={handleDeleteSelected} disabled={loading}>
                      🗑️ Delete Selected
                    </button>
                  </>
                )}
                <button onClick={() => handleCleanupTemplates(true)} disabled={loading}>
                  🧹 Clean Up Unused
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTemplates(templates.map(t => t.filename));
                            } else {
                              setSelectedTemplates([]);
                            }
                          }}
                          checked={selectedTemplates.length === templates.length && templates.length > 0}
                        />
                      </th>
                      <th>Status</th>
                      <th>Template</th>
                      <th>Container</th>
                      <th>Size</th>
                      <th>Modified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map(template => (
                      <tr key={template.filename} className={template.matched ? '' : 'unused'}>
                        <td>
                          <input 
                            type="checkbox"
                            checked={selectedTemplates.includes(template.filename)}
                            onChange={() => toggleTemplateSelection(template.filename)}
                          />
                        </td>
                        <td>
                          {template.matched ? (
                            <span className="status-badge status-matched">✓ Matched</span>
                          ) : (
                            <span className="status-badge status-unused">✗ Unused</span>
                          )}
                        </td>
                        <td>
                          <strong>{template.filename}</strong>
                        </td>
                        <td>
                          {template.container ? (
                            <span className="container-name">{template.container.name}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>{formatBytes(template.size)}</td>
                        <td>{formatDate(template.modified)}</td>
                        <td>
                          <button 
                            className="btn-small btn-danger"
                            onClick={() => handleDeleteTemplate(template.filename)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'containers' && (
          <div className="containers">
            <div className="section-header">
              <h2>Containers ({containers.length})</h2>
              <button onClick={fetchContainers}>🔄 Refresh</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>State</th>
                    <th>Template</th>
                  </tr>
                </thead>
                <tbody>
                  {containers.map(container => (
                    <tr key={container.id}>
                      <td>
                        <span className={`status-indicator status-${container.state}`}>
                          {container.state === 'running' ? '🟢' : '🔴'}
                        </span>
                      </td>
                      <td>
                        <strong>{container.name}</strong>
                        <div className="text-small text-muted">{container.id}</div>
                      </td>
                      <td className="text-small">{container.image}</td>
                      <td>
                        <span className={`badge badge-${container.state}`}>
                          {container.status}
                        </span>
                      </td>
                      <td>
                        {container.has_template ? (
                          <span className="status-badge status-matched">
                            ✓ {container.template.filename}
                          </span>
                        ) : (
                          <span className="status-badge status-warning">
                            ⚠️ No template
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'backups' && (
          <div className="backups">
            <div className="section-header">
              <h2>Backups ({backups.length})</h2>
              <button onClick={handleCreateBackup} disabled={loading}>
                💾 Create New Backup
              </button>
            </div>

            {backups.length === 0 ? (
              <div className="empty-state">
                <p>No backups yet. Create your first backup to get started.</p>
                <button onClick={handleCreateBackup} disabled={loading}>
                  Create Backup
                </button>
              </div>
            ) : (
              <div className="backup-list">
                {backups.map(backup => (
                  <div key={backup.name} className="backup-card">
                    <div className="backup-header">
                      <h3>{backup.name}</h3>
                      <button 
                        className="btn-danger"
                        onClick={() => handleDeleteBackup(backup.name)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="backup-details">
                      <div className="backup-detail">
                        <span className="label">Created:</span>
                        <span>{formatDate(backup.created)}</span>
                      </div>
                      <div className="backup-detail">
                        <span className="label">Size:</span>
                        <span>{formatBytes(backup.size)}</span>
                      </div>
                      {backup.container_count && (
                        <div className="backup-detail">
                          <span className="label">Containers:</span>
                          <span>{backup.container_count}</span>
                        </div>
                      )}
                      {backup.template_count && (
                        <div className="backup-detail">
                          <span className="label">Templates:</span>
                          <span>{backup.template_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Docker Template Manager v1.0 | Made for Unraid</p>
      </footer>
    </div>
  );
}

// Export for global access
window.App = App;

export default App;