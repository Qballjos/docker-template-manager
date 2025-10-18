const API_URL = window.location.origin;

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [stats, setStats] = React.useState(null);
  const [templates, setTemplates] = React.useState([]);
  const [containers, setContainers] = React.useState([]);
  const [backups, setBackups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedTemplates, setSelectedTemplates] = React.useState([]);

  React.useEffect(() => {
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

  const handleRestoreBackup = async (backupName) => {
    if (!window.confirm(`Restore templates from backup ${backupName}? This will copy all templates from the backup to your templates directory. Existing templates with the same name will be overwritten.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/backups/${backupName}/restore`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Backup restored successfully');
        fetchTemplates();
        fetchStats();
      } else {
        alert(data.error || 'Error restoring backup');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Error restoring backup');
    }
    setLoading(false);
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

  return React.createElement('div', { className: 'app' },
    React.createElement('header', { className: 'header' },
      React.createElement('h1', null, '🐳 Docker Template Manager'),
      React.createElement('p', null, 'Manage Unraid Docker Templates')
    ),
    React.createElement('nav', { className: 'tabs' },
      React.createElement('button', { 
        className: activeTab === 'dashboard' ? 'active' : '', 
        onClick: () => setActiveTab('dashboard')
      }, '📊 Dashboard'),
      React.createElement('button', { 
        className: activeTab === 'templates' ? 'active' : '', 
        onClick: () => setActiveTab('templates')
      }, '📄 Templates'),
      React.createElement('button', { 
        className: activeTab === 'containers' ? 'active' : '', 
        onClick: () => setActiveTab('containers')
      }, '📦 Containers'),
      React.createElement('button', { 
        className: activeTab === 'backups' ? 'active' : '', 
        onClick: () => setActiveTab('backups')
      }, '💾 Backups')
    ),
    React.createElement('main', { className: 'content' },
      activeTab === 'dashboard' && stats ? React.createElement('div', { className: 'dashboard' },
        React.createElement('h2', null, 'Dashboard'),
        React.createElement('div', { className: 'stats-grid' },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', null, 'Templates'),
            React.createElement('div', { className: 'stat-value' }, stats.total_templates),
            React.createElement('div', { className: 'stat-detail' }, 
              `${stats.matched_templates} matched, ${stats.unmatched_templates} unused`)
          ),
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', null, 'Containers'),
            React.createElement('div', { className: 'stat-value' }, stats.total_containers),
            React.createElement('div', { className: 'stat-detail' }, 
              `${stats.running_containers} running`)
          ),
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', null, 'Backups'),
            React.createElement('div', { className: 'stat-value' }, stats.total_backups)
          )
        ),
        stats.unmatched_templates > 0 && React.createElement('div', { className: 'alert alert-warning' },
          React.createElement('strong', null, `⚠️ ${stats.unmatched_templates} unused templates detected`),
          React.createElement('button', { onClick: () => handleCleanupTemplates(true), disabled: loading }, 
            'Clean Up Unused Templates')
        ),
        React.createElement('div', { className: 'quick-actions' },
          React.createElement('h3', null, 'Quick Actions'),
          React.createElement('button', { onClick: () => handleCreateBackup(), disabled: loading }, 
            '💾 Create Backup'),
          React.createElement('button', { onClick: () => fetchStats() }, 
            '🔄 Refresh Stats')
        )
      ) : null,
      activeTab === 'templates' ? React.createElement('div', { className: 'templates' },
        React.createElement('div', { className: 'section-header' },
          React.createElement('h2', null, `Templates (${templates.length})`),
          React.createElement('div', { className: 'actions' },
            selectedTemplates.length > 0 && React.createElement(React.Fragment, null,
              React.createElement('span', null, `${selectedTemplates.length} selected`),
              React.createElement('button', { onClick: handleDeleteSelected, disabled: loading }, 
                '🗑️ Delete Selected')
            ),
            React.createElement('button', { onClick: () => handleCleanupTemplates(true), disabled: loading }, 
              '🧹 Clean Up Unused')
          )
        ),
        loading ? React.createElement('div', { className: 'loading' }, 'Loading...') : 
        React.createElement('div', { className: 'table-container' },
          React.createElement('table', null,
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 
                  React.createElement('input', { 
                    type: 'checkbox',
                    onChange: (e) => {
                      if (e.target.checked) {
                        setSelectedTemplates(templates.map(t => t.filename));
                      } else {
                        setSelectedTemplates([]);
                      }
                    },
                    checked: selectedTemplates.length === templates.length && templates.length > 0
                  })
                ),
                React.createElement('th', null, 'Status'),
                React.createElement('th', null, 'Template'),
                React.createElement('th', null, 'Container'),
                React.createElement('th', null, 'Size'),
                React.createElement('th', null, 'Modified'),
                React.createElement('th', null, 'Actions')
              )
            ),
            React.createElement('tbody', null,
              templates.map(template => React.createElement('tr', { 
                key: template.filename, 
                className: template.matched ? '' : 'unused' 
              },
                React.createElement('td', null,
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedTemplates.includes(template.filename),
                    onChange: () => toggleTemplateSelection(template.filename)
                  })
                ),
                React.createElement('td', null,
                  template.matched ? 
                    React.createElement('span', { className: 'status-badge status-matched' }, '✓ Matched') :
                    React.createElement('span', { className: 'status-badge status-unused' }, '✗ Unused')
                ),
                React.createElement('td', null, React.createElement('strong', null, template.filename)),
                React.createElement('td', null,
                  template.container ? 
                    React.createElement('span', { className: 'container-name' }, template.container.name) :
                    React.createElement('span', { className: 'text-muted' }, '-')
                ),
                React.createElement('td', null, formatBytes(template.size)),
                React.createElement('td', null, formatDate(template.modified)),
                React.createElement('td', null,
                  React.createElement('button', {
                    className: 'btn-small btn-danger',
                    onClick: () => handleDeleteTemplate(template.filename)
                  }, 'Delete')
                )
              ))
            )
          )
        )
      ) : null,
      activeTab === 'containers' ? React.createElement('div', { className: 'containers' },
        React.createElement('div', { className: 'section-header' },
          React.createElement('h2', null, `Containers (${containers.length})`),
          React.createElement('button', { onClick: fetchContainers }, '🔄 Refresh')
        ),
        React.createElement('div', { className: 'table-container' },
          React.createElement('table', null,
            React.createElement('thead', null,
              React.createElement('tr', null,
                React.createElement('th', null, 'Status'),
                React.createElement('th', null, 'Name'),
                React.createElement('th', null, 'Image'),
                React.createElement('th', null, 'State'),
                React.createElement('th', null, 'Template')
              )
            ),
            React.createElement('tbody', null,
              containers.map(container => React.createElement('tr', { key: container.id },
                React.createElement('td', null,
                  React.createElement('span', { className: `status-indicator status-${container.state}` },
                    container.state === 'running' ? '🟢' : '🔴')
                ),
                React.createElement('td', null,
                  React.createElement('strong', null, container.name),
                  React.createElement('div', { className: 'text-small text-muted' }, container.id)
                ),
                React.createElement('td', { className: 'text-small' }, container.image),
                React.createElement('td', null,
                  React.createElement('span', { className: `badge badge-${container.state}` }, container.status)
                ),
                React.createElement('td', null,
                  container.has_template ? 
                    React.createElement('span', { className: 'status-badge status-matched' }, 
                      `✓ ${container.template.filename}`) :
                    React.createElement('span', { className: 'status-badge status-warning' }, 
                      '⚠️ No template')
                )
              ))
            )
          )
        )
      ) : null,
      activeTab === 'backups' ? React.createElement('div', { className: 'backups' },
        React.createElement('div', { className: 'section-header' },
          React.createElement('h2', null, `Backups (${backups.length})`),
          React.createElement('button', { onClick: handleCreateBackup, disabled: loading }, 
            '💾 Create New Backup')
        ),
        backups.length === 0 ? 
          React.createElement('div', { className: 'empty-state' },
            React.createElement('p', null, 'No backups yet. Create your first backup to get started.'),
            React.createElement('button', { onClick: handleCreateBackup, disabled: loading }, 
              'Create Backup')
          ) :
          React.createElement('div', { className: 'backup-list' },
            backups.map(backup => React.createElement('div', { key: backup.name, className: 'backup-card' },
              React.createElement('div', { className: 'backup-header' },
                React.createElement('h3', null, backup.name)
              ),
              React.createElement('div', { className: 'backup-details' },
                React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Created:'),
                  React.createElement('span', null, formatDate(backup.created))
                ),
                React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Size:'),
                  React.createElement('span', null, formatBytes(backup.size))
                ),
                backup.container_count && React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Containers:'),
                  React.createElement('span', null, backup.container_count)
                ),
                backup.template_count && React.createElement('div', { className: 'backup-detail' },
                  React.createElement('span', { className: 'label' }, 'Templates:'),
                  React.createElement('span', null, backup.template_count)
                )
              ),
              React.createElement('div', { className: 'backup-actions' },
                React.createElement('button', { 
                  className: 'btn-primary',
                  onClick: () => handleRestoreBackup(backup.name),
                  disabled: loading
                }, '🔄 Restore'),
                React.createElement('button', { 
                  className: 'btn-danger',
                  onClick: () => handleDeleteBackup(backup.name),
                  disabled: loading
                }, '🗑️ Delete')
              )
            ))
          )
      ) : null
    ),
    React.createElement('footer', { className: 'footer' },
      React.createElement('p', null, 'Docker Template Manager v1.0 | Made for Unraid')
    )
  );
}

// Export for global access
window.App = App;