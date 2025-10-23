const API_URL = window.location.origin;

function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [stats, setStats] = React.useState(null);
  const [templates, setTemplates] = React.useState([]);
  const [containers, setContainers] = React.useState([]);
  const [backups, setBackups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedTemplates, setSelectedTemplates] = React.useState([]);
  const [selectedContainers, setSelectedContainers] = React.useState([]);
  const [selectedContainerRow, setSelectedContainerRow] = React.useState(null);
  const [selectedBackups, setSelectedBackups] = React.useState([]);
  const [selectedBackupRow, setSelectedBackupRow] = React.useState(null);
  const [templateSortBy, setTemplateSortBy] = React.useState('name');
  const [templateSortOrder, setTemplateSortOrder] = React.useState('asc');
  const [containerSortBy, setContainerSortBy] = React.useState('name');
  const [containerSortOrder, setContainerSortOrder] = React.useState('asc');
  const [backupSortBy, setBackupSortBy] = React.useState('name');
  const [backupSortOrder, setBackupSortOrder] = React.useState('desc');
  const [apiKey, setApiKey] = React.useState(localStorage.getItem('apiKey') || '');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = React.useState(!localStorage.getItem('apiKey'));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all'); // all, matched, unmatched
  const [sortBy, setSortBy] = React.useState('name'); // name, size, date
  const [editingTemplate, setEditingTemplate] = React.useState(null);
  const [editContent, setEditContent] = React.useState('');
  const [editorMode, setEditorMode] = React.useState('form'); // 'form' or 'xml'
  const [formData, setFormData] = React.useState({
    name: '',
    repository: '',
    tag: '',
    network: 'bridge',
    restart: 'unless-stopped',
    ports: [],
    volumes: [],
    environment: []
  });
  const [renamingTemplate, setRenamingTemplate] = React.useState(null);
  const [newTemplateName, setNewTemplateName] = React.useState('');
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [version, setVersion] = React.useState(null);
  const [updateInfo, setUpdateInfo] = React.useState(null);
  const [checkingUpdates, setCheckingUpdates] = React.useState(false);

  // Apply theme on mount and change
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // API helper with authentication
  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      setShowApiKeyPrompt(true);
      localStorage.removeItem('apiKey');
      throw new Error('Unauthorized - Invalid API key');
    }
    
    return response;
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const key = e.target.apikey.value.trim();
    if (key) {
      localStorage.setItem('apiKey', key);
      setApiKey(key);
      setShowApiKeyPrompt(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Clear API key and logout?')) {
      localStorage.removeItem('apiKey');
      setApiKey('');
      setShowApiKeyPrompt(true);
    }
  };

  React.useEffect(() => {
    if (apiKey && !showApiKeyPrompt) {
      fetchStats();
      fetchTemplates();
      fetchContainers();
      fetchBackups();
    }
  }, [apiKey, showApiKeyPrompt]);

  // Fetch version on mount
  React.useEffect(() => {
    fetchVersion();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
    setLoading(false);
  };

  const fetchContainers = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/containers`);
      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error('Error fetching containers:', error);
    }
  };

  const fetchBackups = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/backups`);
      const data = await response.json();
      setBackups(data);
    } catch (error) {
      console.error('Error fetching backups:', error);
    }
  };

  const fetchVersion = async () => {
    try {
      const response = await fetch(`${API_URL}/api/version`);
      const data = await response.json();
      setVersion(data);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  const checkForUpdates = async () => {
    setCheckingUpdates(true);
    try {
      const response = await fetch(`${API_URL}/api/check-updates`);
      const data = await response.json();
      setUpdateInfo(data);
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
    setCheckingUpdates(false);
  };

  const handleDeleteTemplate = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`, {
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

  const handleCloneTemplate = async (filename) => {
    const baseName = filename.replace('.xml', '');
    const defaultName = `${baseName}-copy`;
    
    const newName = prompt(`Clone "${filename}" as:`, defaultName);
    
    if (!newName) return; // Cancelled
    
    const trimmedName = newName.trim();
    if (!trimmedName) {
      alert('Template name cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}/clone`, {
        method: 'POST',
        body: JSON.stringify({ new_name: trimmedName })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || `Template cloned as ${data.filename}`);
        fetchTemplates();
        fetchStats();
      } else {
        alert(data.error || 'Failed to clone template');
      }
    } catch (error) {
      console.error('Error cloning template:', error);
      alert('Error cloning template');
    }
    setLoading(false);
  };

  const handleViewTemplate = async (filename) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${filename}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Template content loaded:', data.content);
        setEditingTemplate(filename);
        setEditContent(data.content);
        setEditorMode('form');
        
        // Parse XML to form data
        const parsedData = parseXmlToFormData(data.content);
        console.log('Parsed form data:', parsedData);
        
        // Set form data immediately
        setFormData(parsedData);
        console.log('FormData state set with:', parsedData);
        
      } else {
        alert('Failed to load template');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      alert('Error loading template');
    }
    setLoading(false);
  };

  // Parse XML content to form data
  const parseXmlToFormData = (xmlContent) => {
    try {
      console.log('Parsing XML content:', xmlContent);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      console.log('XML document parsed:', xmlDoc);
      console.log('Name element:', xmlDoc.querySelector('Name'));
      console.log('Repository element:', xmlDoc.querySelector('Repository'));
      
      const formData = {
        name: xmlDoc.querySelector('Name')?.textContent || '',
        repository: xmlDoc.querySelector('Repository')?.textContent || '',
        tag: xmlDoc.querySelector('Tag')?.textContent || '',
        network: xmlDoc.querySelector('Network')?.textContent || 'bridge',
        restart: xmlDoc.querySelector('RestartPolicy')?.textContent || 'unless-stopped',
        ports: [],
        volumes: [],
        environment: []
      };
      
      console.log('Basic form data extracted:', formData);

      // Parse ports
      const portMappings = xmlDoc.querySelectorAll('Port');
      console.log('Found ports:', portMappings.length);
      portMappings.forEach(port => {
        const portData = {
          host: port.getAttribute('HostPort') || '',
          container: port.getAttribute('ContainerPort') || '',
          protocol: port.getAttribute('Protocol') || 'tcp'
        };
        console.log('Port data:', portData);
        formData.ports.push(portData);
      });

      // Parse volumes
      const volumeMappings = xmlDoc.querySelectorAll('Volume');
      console.log('Found volumes:', volumeMappings.length);
      volumeMappings.forEach(volume => {
        const volumeData = {
          host: volume.getAttribute('HostDir') || '',
          container: volume.getAttribute('ContainerDir') || '',
          mode: volume.getAttribute('Mode') || 'rw'
        };
        console.log('Volume data:', volumeData);
        formData.volumes.push(volumeData);
      });

      // Parse environment variables
      const envVars = xmlDoc.querySelectorAll('Environment');
      console.log('Found environment variables:', envVars.length);
      envVars.forEach(env => {
        const envData = {
          key: env.getAttribute('Name') || '',
          value: env.getAttribute('Value') || ''
        };
        console.log('Environment data:', envData);
        formData.environment.push(envData);
      });

      console.log('Final parsed form data:', formData);
      return formData;
    } catch (error) {
      console.error('Error parsing XML:', error);
      return {};
    }
  };

  // Convert form data back to XML
  const formDataToXml = (formData) => {
    let xml = `<?xml version="1.0"?>
<Container version="2">
  <Name>${formData.name || ''}</Name>
  <Repository>${formData.repository || ''}</Repository>
  <Tag>${formData.tag || 'latest'}</Tag>
  <Network>${formData.network || 'bridge'}</Network>
  <RestartPolicy>${formData.restart || 'unless-stopped'}</RestartPolicy>`;

    // Add ports
    if (formData.ports && formData.ports.length > 0) {
      formData.ports.forEach(port => {
        if (port.host && port.container) {
          xml += `\n  <Port HostPort="${port.host}" ContainerPort="${port.container}" Protocol="${port.protocol || 'tcp'}"/>`;
        }
      });
    }

    // Add volumes
    if (formData.volumes && formData.volumes.length > 0) {
      formData.volumes.forEach(volume => {
        if (volume.host && volume.container) {
          xml += `\n  <Volume HostDir="${volume.host}" ContainerDir="${volume.container}" Mode="${volume.mode || 'rw'}"/>`;
        }
      });
    }

    // Add environment variables
    if (formData.environment && formData.environment.length > 0) {
      formData.environment.forEach(env => {
        if (env.key && env.value) {
          xml += `\n  <Environment Name="${env.key}" Value="${env.value}"/>`;
        }
      });
    }

    xml += '\n</Container>';
    return xml;
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    
    setLoading(true);
    try {
      // Use form data or raw XML based on editor mode
      const content = editorMode === 'form' ? formDataToXml(formData) : editContent;
      
      const response = await fetchWithAuth(`${API_URL}/api/templates/${editingTemplate}/edit`, {
        method: 'PUT',
        body: JSON.stringify({ content: content })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Template saved successfully');
        setEditingTemplate(null);
        setEditContent('');
        setFormData({});
        setEditorMode('form');
        fetchTemplates();
      } else {
        alert(data.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template');
    }
    setLoading(false);
  };

  const handleCloseEditor = () => {
    if (editContent && window.confirm('You have unsaved changes. Close anyway?')) {
      setEditingTemplate(null);
      setEditContent('');
      setFormData({});
      setEditorMode('form');
    } else if (!editContent) {
      setEditingTemplate(null);
      setEditContent('');
      setFormData({});
      setEditorMode('form');
    }
  };

  // Form helper functions
  const addPort = () => {
    setFormData(prev => ({
      ...prev,
      ports: [...(prev.ports || []), { host: '', container: '', protocol: 'tcp' }]
    }));
  };

  const removePort = (index) => {
    setFormData(prev => ({
      ...prev,
      ports: prev.ports.filter((_, i) => i !== index)
    }));
  };

  const addVolume = () => {
    setFormData(prev => ({
      ...prev,
      volumes: [...(prev.volumes || []), { host: '', container: '', mode: 'rw' }]
    }));
  };

  const removeVolume = (index) => {
    setFormData(prev => ({
      ...prev,
      volumes: prev.volumes.filter((_, i) => i !== index)
    }));
  };

  const addEnvironment = () => {
    setFormData(prev => ({
      ...prev,
      environment: [...(prev.environment || []), { key: '', value: '' }]
    }));
  };

  const removeEnvironment = (index) => {
    setFormData(prev => ({
      ...prev,
      environment: prev.environment.filter((_, i) => i !== index)
    }));
  };

  // Container selection helpers
  const toggleContainerSelection = (containerId) => {
    setSelectedContainers(prev => 
      prev.includes(containerId) 
        ? prev.filter(id => id !== containerId)
        : [...prev, containerId]
    );
  };

  const handleBulkContainerAction = async (action) => {
    if (selectedContainers.length === 0) {
      alert('No containers selected');
      return;
    }

    if (!window.confirm(`Perform ${action} on ${selectedContainers.length} containers?`)) {
      return;
    }

    setLoading(true);
    for (const containerId of selectedContainers) {
      try {
        await handleContainerAction(containerId, action);
      } catch (error) {
        console.error(`Error ${action}ing container ${containerId}:`, error);
      }
    }
    setSelectedContainers([]);
    setLoading(false);
    alert(`Performed ${action} on ${selectedContainers.length} containers`);
  };

  // Sorting helper functions
  const handleTemplateSort = (column) => {
    if (templateSortBy === column) {
      setTemplateSortOrder(templateSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setTemplateSortBy(column);
      setTemplateSortOrder('asc');
    }
  };

  const handleContainerSort = (column) => {
    if (containerSortBy === column) {
      setContainerSortOrder(containerSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setContainerSortBy(column);
      setContainerSortOrder('asc');
    }
  };

  const handleBackupSort = (column) => {
    if (backupSortBy === column) {
      setBackupSortOrder(backupSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setBackupSortBy(column);
      setBackupSortOrder('desc'); // Default to newest first for backups
    }
  };

  const getSortIcon = (currentSortBy, sortBy, sortOrder) => {
    if (currentSortBy !== sortBy) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleRenameTemplate = (filename) => {
    const baseName = filename.replace('.xml', '');
    setRenamingTemplate(filename);
    setNewTemplateName(baseName);
  };

  const handleSaveRename = async () => {
    if (!renamingTemplate || !newTemplateName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/${renamingTemplate}/rename`, {
        method: 'PATCH',
        body: JSON.stringify({ new_name: newTemplateName.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Template renamed successfully');
        setRenamingTemplate(null);
        setNewTemplateName('');
        fetchTemplates();
        fetchStats();
      } else {
        alert(data.error || 'Failed to rename template');
      }
    } catch (error) {
      console.error('Error renaming template:', error);
      alert('Error renaming template');
    }
    setLoading(false);
  };

  const handleContainerAction = async (containerName, action) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/containers/${containerName}/${action}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || `Container ${action}ed successfully`);
        fetchContainers();
      } else {
        alert(data.error || `Failed to ${action} container`);
      }
    } catch (error) {
      console.error(`Error ${action}ing container:`, error);
      alert(`Error ${action}ing container`);
    }
    setLoading(false);
  };

  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Dashboard',
      'templates': `Templates (${getFilteredAndSortedTemplates().length}/${templates.length})`,
      'containers': `Containers (${containers.length})`,
      'backups': `Backups (${backups.length})`
    };
    return titles[activeTab] || 'Dashboard';
  };

  const handleCleanupTemplates = async (dryRun = true) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/templates/cleanup`, {
        method: 'POST',
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
      const response = await fetchWithAuth(`${API_URL}/api/backups`, {
        method: 'POST',
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
      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}`, {
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

  const toggleBackupSelection = (backupName) => {
    setSelectedBackups(prev => 
      prev.includes(backupName) 
        ? prev.filter(name => name !== backupName)
        : [...prev, backupName]
    );
  };

  const handleBulkBackupAction = async (action) => {
    if (selectedBackups.length === 0) {
      alert('No backups selected');
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Delete ${selectedBackups.length} selected backups?`)) {
        return;
      }
    }
    
    setLoading(true);
    try {
      const promises = selectedBackups.map(backupName => {
        if (action === 'delete') {
          return fetchWithAuth(`${API_URL}/api/backups/${backupName}`, {
            method: 'DELETE'
          });
        }
        return Promise.resolve();
      });
      
      await Promise.all(promises);
      setSelectedBackups([]);
      fetchBackups();
    } catch (error) {
      console.error(`Error ${action}ing backups:`, error);
      alert(`Error ${action}ing backups`);
    }
    setLoading(false);
  };

  const handleRestoreBackup = async (backupName) => {
    if (!window.confirm(`Restore templates from backup ${backupName}? This will copy all templates from the backup to your templates directory. Existing templates with the same name will be overwritten.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/api/backups/${backupName}/restore`, {
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

  // Simple SVG Pie Chart Component
  const PieChart = ({ matched, unmatched }) => {
    const total = matched + unmatched;
    if (total === 0) return null;
    
    const matchedPercent = (matched / total) * 100;
    const unmatchedPercent = (unmatched / total) * 100;
    
    // Calculate pie chart segments
    const matchedAngle = (matched / total) * 360;
    const unmatchedAngle = (unmatched / total) * 360;
    
    const getCoordinatesForPercent = (percent) => {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    };
    
    const matchedPath = () => {
      const [startX, startY] = getCoordinatesForPercent(0);
      const [endX, endY] = getCoordinatesForPercent(matched / total);
      const largeArcFlag = matched / total > 0.5 ? 1 : 0;
      
      return [
        `M 0 0`,
        `L ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`
      ].join(' ');
    };
    
    const unmatchedPath = () => {
      const [startX, startY] = getCoordinatesForPercent(matched / total);
      const [endX, endY] = getCoordinatesForPercent(1);
      const largeArcFlag = unmatched / total > 0.5 ? 1 : 0;
      
      return [
        `M 0 0`,
        `L ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`
      ].join(' ');
    };
    
    return React.createElement('div', { className: 'pie-chart-container' },
      React.createElement('svg', { viewBox: '-1 -1 2 2', className: 'pie-chart' },
        React.createElement('path', {
          d: matchedPath(),
          fill: '#5cb85c',
          stroke: '#1b1b1b',
          strokeWidth: '0.02'
        }),
        React.createElement('path', {
          d: unmatchedPath(),
          fill: '#f0ad4e',
          stroke: '#1b1b1b',
          strokeWidth: '0.02'
        })
      ),
      React.createElement('div', { className: 'chart-legend' },
        React.createElement('div', { className: 'legend-item' },
          React.createElement('span', { className: 'legend-color', style: { background: '#5cb85c' } }),
          React.createElement('span', null, `Matched: ${matched} (${matchedPercent.toFixed(1)}%)`)
        ),
        React.createElement('div', { className: 'legend-item' },
          React.createElement('span', { className: 'legend-color', style: { background: '#f0ad4e' } }),
          React.createElement('span', null, `Unused: ${unmatched} (${unmatchedPercent.toFixed(1)}%)`)
        )
      )
    );
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
        await fetchWithAuth(`${API_URL}/api/templates/${filename}`, { method: 'DELETE' });
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

  // Filter and sort templates
  const getFilteredAndSortedTemplates = () => {
    let filtered = templates;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.container && t.container.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus === 'matched') {
      filtered = filtered.filter(t => t.matched);
    } else if (filterStatus === 'unmatched') {
      filtered = filtered.filter(t => !t.matched);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let result = 0;
      if (templateSortBy === 'name') {
        result = a.filename.localeCompare(b.filename);
      } else if (templateSortBy === 'size') {
        result = b.size - a.size;
      } else if (templateSortBy === 'date') {
        result = new Date(b.modified) - new Date(a.modified);
      }
      return templateSortOrder === 'desc' ? -result : result;
    });

    return filtered;
  };

  // Filter and sort containers
  const getFilteredAndSortedContainers = () => {
    let filtered = containers;

    // Apply sorting
    filtered.sort((a, b) => {
      let result = 0;
      if (containerSortBy === 'name') {
        result = a.name.localeCompare(b.name);
      } else if (containerSortBy === 'image') {
        result = a.image.localeCompare(b.image);
      } else if (containerSortBy === 'state') {
        result = a.state.localeCompare(b.state);
      }
      return containerSortOrder === 'desc' ? -result : result;
    });

    return filtered;
  };

  // Filter and sort backups
  const getFilteredAndSortedBackups = () => {
    let filtered = backups;

    // Apply sorting
    filtered.sort((a, b) => {
      let result = 0;
      if (backupSortBy === 'name') {
        result = a.name.localeCompare(b.name);
      } else if (backupSortBy === 'size') {
        result = b.size - a.size;
      } else if (backupSortBy === 'date') {
        result = new Date(b.created) - new Date(a.created);
      } else if (backupSortBy === 'containers') {
        result = (b.container_count || 0) - (a.container_count || 0);
      } else if (backupSortBy === 'templates') {
        result = (b.template_count || 0) - (a.template_count || 0);
      }
      return backupSortOrder === 'desc' ? -result : result;
    });

    return filtered;
  };

  return React.createElement('div', { className: 'app-container' },
    // API Key Prompt Modal
    showApiKeyPrompt && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal' },
        React.createElement('h2', null, '🔑 API Key Required'),
        React.createElement('p', null, 'Enter your API key to access Docker Template Manager.'),
        React.createElement('p', { className: 'text-small text-muted' }, 
          'Find your API key in Docker logs: Docker tab → Container icon → Logs'),
        React.createElement('form', { onSubmit: handleApiKeySubmit },
          React.createElement('input', {
            type: 'password',
            name: 'apikey',
            placeholder: 'Enter API key',
            autoFocus: true,
            required: true,
            style: { width: '100%', padding: '10px', marginBottom: '10px', fontSize: '14px' }
          }),
          React.createElement('button', { type: 'submit', className: 'btn btn-primary' }, 'Submit')
        )
      )
    ),
    // Template Editor Modal
    editingTemplate && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal modal-large' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('div', { className: 'modal-header-left' },
            React.createElement('h2', null, `✏️ Edit: ${editingTemplate}`)
          ),
          React.createElement('div', { className: 'modal-header-center' },
            React.createElement('div', { className: 'editor-mode-toggle' },
              React.createElement('button', {
                className: `mode-button ${editorMode === 'form' ? 'active' : ''}`,
                onClick: () => setEditorMode('form')
              }, 'Form Editor'),
              React.createElement('button', {
                className: `mode-button ${editorMode === 'xml' ? 'active' : ''}`,
                onClick: () => setEditorMode('xml')
              }, 'Raw XML')
            )
          ),
          React.createElement('div', { className: 'modal-header-right' },
          React.createElement('button', {
            className: 'close-button',
            onClick: handleCloseEditor
          }, '✕')
          )
        ),
        React.createElement('div', { className: 'modal-body' },
          editorMode === 'form' ? 
            // Form-based editor
            React.createElement('div', { className: 'form-editor' },
              // Debug: Log formData when form is rendered
              console.log('FormData when rendering form:', formData),
              // Basic Information
              React.createElement('div', { className: 'form-section' },
                React.createElement('h3', null, 'Basic Information'),
                React.createElement('div', { className: 'form-row' },
                  React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, 'Container Name'),
                    React.createElement('input', {
                      type: 'text',
                      value: formData.name || '',
                      onChange: (e) => {
                        console.log('Name field changed:', e.target.value);
                        setFormData(prev => ({ ...prev, name: e.target.value }));
                      },
                      placeholder: 'my-container',
                      style: { 
                        backgroundColor: formData.name ? '#f0f8ff' : '#fff',
                        border: formData.name ? '2px solid #4CAF50' : '1px solid #ddd'
                      }
                    })
                  ),
                  React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, 'Repository'),
                    React.createElement('input', {
                      type: 'text',
                      value: formData.repository || '',
                      onChange: (e) => setFormData(prev => ({ ...prev, repository: e.target.value })),
                      placeholder: 'nginx',
                      style: { 
                        backgroundColor: formData.repository ? '#f0f8ff' : '#fff',
                        border: formData.repository ? '2px solid #4CAF50' : '1px solid #ddd'
                      }
                    })
                  )
                ),
                React.createElement('div', { className: 'form-row' },
                  React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, 'Tag'),
                    React.createElement('input', {
                      type: 'text',
                      value: formData.tag || '',
                      onChange: (e) => setFormData(prev => ({ ...prev, tag: e.target.value })),
                      placeholder: 'latest'
                    })
                  ),
                  React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, 'Network'),
                    React.createElement('select', {
                      value: formData.network || 'bridge',
                      onChange: (e) => setFormData(prev => ({ ...prev, network: e.target.value }))
                    },
                      React.createElement('option', { value: 'bridge' }, 'Bridge'),
                      React.createElement('option', { value: 'host' }, 'Host'),
                      React.createElement('option', { value: 'none' }, 'None')
                    )
                  )
                ),
                React.createElement('div', { className: 'form-row' },
                  React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, 'Restart Policy'),
                    React.createElement('select', {
                      value: formData.restart || 'unless-stopped',
                      onChange: (e) => setFormData(prev => ({ ...prev, restart: e.target.value }))
                    },
                      React.createElement('option', { value: 'no' }, 'No'),
                      React.createElement('option', { value: 'always' }, 'Always'),
                      React.createElement('option', { value: 'unless-stopped' }, 'Unless Stopped'),
                      React.createElement('option', { value: 'on-failure' }, 'On Failure')
                    )
                  )
                )
              ),
              // Port Mappings
              React.createElement('div', { className: 'form-section' },
                React.createElement('div', { className: 'section-header' },
                  React.createElement('h3', null, 'Port Mappings'),
                  React.createElement('button', { 
                    type: 'button', 
                    className: 'btn btn-secondary btn-small',
                    onClick: addPort
                  }, '+ Add Port')
                ),
                React.createElement('div', { className: 'ports-list' },
                  (formData.ports || []).map((port, index) => React.createElement('div', { key: index, className: 'port-item' },
                    React.createElement('input', {
                      type: 'text',
                      placeholder: 'Host Port',
                      value: port.host,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        ports: prev.ports.map((p, i) => i === index ? { ...p, host: e.target.value } : p)
                      }))
                    }),
                    React.createElement('span', null, ':'),
                    React.createElement('input', {
                      type: 'text',
                      placeholder: 'Container Port',
                      value: port.container,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        ports: prev.ports.map((p, i) => i === index ? { ...p, container: e.target.value } : p)
                      }))
                    }),
                    React.createElement('select', {
                      value: port.protocol,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        ports: prev.ports.map((p, i) => i === index ? { ...p, protocol: e.target.value } : p)
                      }))
                    },
                      React.createElement('option', { value: 'tcp' }, 'TCP'),
                      React.createElement('option', { value: 'udp' }, 'UDP')
                    ),
                    React.createElement('button', {
                      type: 'button',
                      className: 'btn btn-danger btn-small',
                      onClick: () => removePort(index)
                    }, '×')
                  ))
                )
              ),
              // Volume Mappings
              React.createElement('div', { className: 'form-section' },
                React.createElement('div', { className: 'section-header' },
                  React.createElement('h3', null, 'Volume Mappings'),
                  React.createElement('button', { 
                    type: 'button', 
                    className: 'btn btn-secondary btn-small',
                    onClick: addVolume
                  }, '+ Add Volume')
                ),
                React.createElement('div', { className: 'volumes-list' },
                  (formData.volumes || []).map((volume, index) => React.createElement('div', { key: index, className: 'volume-item' },
                    React.createElement('input', {
                      type: 'text',
                      placeholder: 'Host Directory',
                      value: volume.host,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        volumes: prev.volumes.map((v, i) => i === index ? { ...v, host: e.target.value } : v)
                      }))
                    }),
                    React.createElement('span', null, ':'),
                    React.createElement('input', {
                      type: 'text',
                      placeholder: 'Container Directory',
                      value: volume.container,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        volumes: prev.volumes.map((v, i) => i === index ? { ...v, container: e.target.value } : v)
                      }))
                    }),
                    React.createElement('select', {
                      value: volume.mode,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        volumes: prev.volumes.map((v, i) => i === index ? { ...v, mode: e.target.value } : v)
                      }))
                    },
                      React.createElement('option', { value: 'rw' }, 'Read/Write'),
                      React.createElement('option', { value: 'ro' }, 'Read Only')
                    ),
                    React.createElement('button', {
                      type: 'button',
                      className: 'btn btn-danger btn-small',
                      onClick: () => removeVolume(index)
                    }, '×')
                  ))
                )
              ),
              // Environment Variables
              React.createElement('div', { className: 'form-section' },
                React.createElement('div', { className: 'section-header' },
                  React.createElement('h3', null, 'Environment Variables'),
                  React.createElement('button', { 
                    type: 'button', 
                    className: 'btn btn-secondary btn-small',
                    onClick: addEnvironment
                  }, '+ Add Variable')
                ),
                React.createElement('div', { className: 'environment-list' },
                  (formData.environment || []).map((env, index) => React.createElement('div', { key: index, className: 'env-item' },
                    React.createElement('input', {
                      type: 'text',
                      placeholder: 'Variable Name',
                      value: env.key,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        environment: prev.environment.map((e, i) => i === index ? { ...e, key: e.target.value } : e)
                      }))
                    }),
                    React.createElement('span', null, '='),
                    React.createElement('input', {
                      type: 'text',
                      placeholder: 'Value',
                      value: env.value,
                      onChange: (e) => setFormData(prev => ({
                        ...prev,
                        environment: prev.environment.map((e, i) => i === index ? { ...e, value: e.target.value } : e)
                      }))
                    }),
                    React.createElement('button', {
                      type: 'button',
                      className: 'btn btn-danger btn-small',
                      onClick: () => removeEnvironment(index)
                    }, '×')
                  ))
                )
              )
            ) :
            // Raw XML editor
          React.createElement('textarea', {
            className: 'code-editor',
            value: editContent,
            onChange: (e) => setEditContent(e.target.value),
            spellCheck: false,
            rows: 20
          })
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: handleCloseEditor
          }, 'Cancel'),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: handleSaveTemplate,
            disabled: loading
          }, loading ? 'Saving...' : 'Save Changes')
        )
      )
    ),
    // Rename Template Modal
    renamingTemplate && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal' },
        React.createElement('h2', null, '✏️ Rename Template'),
        React.createElement('p', null, `Renaming: ${renamingTemplate}`),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('label', { style: { display: 'block', marginBottom: '5px', color: 'var(--unraid-text-secondary)' } }, 'New name:'),
          React.createElement('input', {
            type: 'text',
            value: newTemplateName,
            onChange: (e) => setNewTemplateName(e.target.value),
            placeholder: 'template-name',
            style: { width: '100%', padding: '10px', fontSize: '14px' },
            autoFocus: true
          })
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: () => {
              setRenamingTemplate(null);
              setNewTemplateName('');
            }
          }, 'Cancel'),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: handleSaveRename,
            disabled: loading || !newTemplateName.trim()
          }, loading ? 'Renaming...' : 'Rename')
        )
      )
    ),
    // Sidebar Navigation
    !showApiKeyPrompt && React.createElement('aside', { 
      className: `sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`
    },
      // Sidebar Header
      React.createElement('div', { className: 'sidebar-header' },
        React.createElement('div', { className: 'sidebar-logo' }, 
          React.createElement('img', { 
            src: '/static/png/logo.png', 
            alt: 'Docker Template Manager',
            className: 'logo'
          })
        )
      ),
      // Sidebar Navigation
      React.createElement('nav', { className: 'sidebar-nav' },
        React.createElement('div', {
          className: `nav-item ${activeTab === 'dashboard' ? 'active' : ''}`,
          onClick: () => { setActiveTab('dashboard'); setMobileMenuOpen(false); }
        },
          React.createElement('i', { className: 'lni lni-dashboard nav-icon' }),
          React.createElement('span', null, 'Dashboard')
        ),
        React.createElement('div', {
          className: `nav-item ${activeTab === 'templates' ? 'active' : ''}`,
          onClick: () => { setActiveTab('templates'); setMobileMenuOpen(false); }
        },
          React.createElement('i', { className: 'lni lni-files nav-icon' }),
          React.createElement('span', null, 'Templates')
        ),
        React.createElement('div', {
          className: `nav-item ${activeTab === 'containers' ? 'active' : ''}`,
          onClick: () => { setActiveTab('containers'); setMobileMenuOpen(false); }
        },
          React.createElement('i', { className: 'lni lni-docker nav-icon' }),
          React.createElement('span', null, 'Containers')
        ),
        React.createElement('div', {
          className: `nav-item ${activeTab === 'backups' ? 'active' : ''}`,
          onClick: () => { setActiveTab('backups'); setMobileMenuOpen(false); }
        },
          React.createElement('i', { className: 'lni lni-cloud-upload nav-icon' }),
          React.createElement('span', null, 'Backups')
        )
      ),
      // Sidebar Footer
      React.createElement('div', { className: 'sidebar-footer' },
        React.createElement('div', { className: 'theme-toggle', onClick: toggleTheme },
          React.createElement('span', { className: 'theme-label' },
            React.createElement('i', { className: `lni ${theme === 'dark' ? 'lni-moon' : 'lni-sun'}` }),
            React.createElement('span', null, theme === 'dark' ? 'Dark' : 'Light')
          ),
          React.createElement('div', { className: `theme-switch ${theme === 'dark' ? 'active' : ''}` },
            React.createElement('div', { className: 'theme-switch-thumb' })
          )
        ),
        React.createElement('button', {
          onClick: handleLogout,
          style: { 
            width: '100%', 
            marginTop: '10px', 
            padding: '10px', 
            background: 'var(--unraid-bg-tertiary)',
            border: '1px solid var(--unraid-border)',
            borderRadius: '6px',
            color: 'var(--unraid-text-secondary)',
            cursor: 'pointer',
            fontSize: '13px'
          }
        }, '🔓 Logout')
      )
    ),
    // Mobile Overlay
    !showApiKeyPrompt && mobileMenuOpen && React.createElement('div', {
      className: 'sidebar-overlay active',
      onClick: () => setMobileMenuOpen(false)
    }),
    // Main Content
    !showApiKeyPrompt && React.createElement('main', { className: 'main-content' },
      // Top Bar
      React.createElement('div', { className: 'top-bar' },
        React.createElement('div', { className: 'top-bar-title' },
          React.createElement('div', { className: 'breadcrumb' },
            React.createElement('span', { className: 'breadcrumb-item' }, 'Docker Template Manager'),
            React.createElement('span', { className: 'breadcrumb-separator' }, '›'),
            React.createElement('span', { className: 'breadcrumb-current' }, getPageTitle())
          )
        ),
        React.createElement('div', { className: 'top-bar-actions' },
          activeTab === 'templates' && selectedTemplates.length > 0 && React.createElement(React.Fragment, null,
            React.createElement('span', { className: 'selection-count' }, `${selectedTemplates.length} selected`),
            React.createElement('button', {
              className: 'top-bar-button danger',
              onClick: handleDeleteSelected,
              disabled: loading
            }, 
              React.createElement('i', { className: 'lni lni-trash-can' }),
              React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete Selected')
            )
          ),
          activeTab === 'templates' && selectedTemplates.length === 0 && React.createElement('button', {
            className: 'top-bar-button primary',
            onClick: () => handleCleanupTemplates(true),
            disabled: loading
          }, 
            React.createElement('i', { className: 'lni lni-broom' }),
            React.createElement('span', { style: { marginLeft: '4px' } }, 'Cleanup')
          ),
          activeTab === 'containers' && selectedContainers.length > 0 && React.createElement(React.Fragment, null,
            React.createElement('span', { className: 'selection-count' }, `${selectedContainers.length} selected`),
            React.createElement('button', {
              className: 'top-bar-button danger',
              onClick: () => handleBulkContainerAction('stop'),
              disabled: loading
            }, 
              React.createElement('i', { className: 'lni lni-stop' }),
              React.createElement('span', { style: { marginLeft: '4px' } }, 'Stop Selected')
            ),
            React.createElement('button', {
              className: 'top-bar-button secondary',
              onClick: () => handleBulkContainerAction('restart'),
              disabled: loading
            }, 
              React.createElement('i', { className: 'lni lni-reload' }),
              React.createElement('span', { style: { marginLeft: '4px' } }, 'Restart Selected')
            )
          ),
          activeTab === 'containers' && selectedContainers.length === 0 && React.createElement('button', {
            className: 'top-bar-button primary',
            onClick: fetchContainers,
            disabled: loading
          }, 
            React.createElement('i', { className: 'lni lni-reload' }),
            React.createElement('span', { style: { marginLeft: '4px' } }, 'Refresh')
          ),
          activeTab === 'backups' && selectedBackups.length > 0 && React.createElement(React.Fragment, null,
            React.createElement('span', { className: 'selection-count' }, `${selectedBackups.length} selected`),
            React.createElement('button', {
              className: 'top-bar-button danger',
              onClick: () => handleBulkBackupAction('delete'),
              disabled: loading
            }, 
              React.createElement('i', { className: 'lni lni-trash-can' }),
              React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete Selected')
            )
          ),
          activeTab === 'backups' && selectedBackups.length === 0 && React.createElement('button', {
            className: 'top-bar-button primary',
            onClick: handleCreateBackup,
            disabled: loading
          }, 
            React.createElement('i', { className: 'lni lni-cloud-upload' }),
            React.createElement('span', { style: { marginLeft: '4px' } }, 'Create Backup')
          )
        )
      ),
      // Content Wrapper
      React.createElement('div', { className: 'content-wrapper' },
      activeTab === 'dashboard' && stats ? React.createElement('div', { className: 'dashboard' },
        React.createElement('div', { className: 'stats-grid' },
          React.createElement('div', { 
            className: 'stat-card clickable',
            onClick: () => setActiveTab('templates')
          },
            React.createElement('h3', null, 'Templates'),
            React.createElement('div', { className: 'stat-value' }, stats.total_templates),
            React.createElement('div', { className: 'stat-detail' }, 
              `${stats.matched_templates} matched, ${stats.unmatched_templates} unused`)
          ),
          React.createElement('div', { 
            className: 'stat-card clickable',
            onClick: () => setActiveTab('containers')
          },
            React.createElement('h3', null, 'Containers'),
            React.createElement('div', { className: 'stat-value' }, stats.total_containers),
            React.createElement('div', { className: 'stat-detail' }, 
              `${stats.running_containers} running`)
          ),
          React.createElement('div', { 
            className: 'stat-card clickable',
            onClick: () => setActiveTab('backups')
          },
            React.createElement('h3', null, 'Backups'),
            React.createElement('div', { className: 'stat-value' }, stats.total_backups)
          )
        ),
        // Pie Chart
        stats.total_templates > 0 && React.createElement('div', { className: 'chart-section' },
          React.createElement('h3', null, 'Template Status Overview'),
          React.createElement(PieChart, {
            matched: stats.matched_templates,
            unmatched: stats.unmatched_templates
          })
        ),
        stats.unmatched_templates > 0 && React.createElement('div', { className: 'alert alert-warning' },
          React.createElement('strong', null, `⚠️ ${stats.unmatched_templates} unused templates detected`)
        ),
        React.createElement('div', { className: 'quick-actions' },
          React.createElement('h3', null, 'Quick Actions'),
          React.createElement('button', { onClick: () => handleCreateBackup(), disabled: loading }, 
            React.createElement('i', { className: 'lni lni-cloud-upload' }),
            React.createElement('span', { style: { marginLeft: '4px' } }, 'Create Backup')
          ),
          React.createElement('button', { onClick: () => fetchStats() }, 
            React.createElement('i', { className: 'lni lni-reload' }),
            React.createElement('span', { style: { marginLeft: '4px' } }, 'Refresh Stats')
          ),
        ),
        // Migration Guide Section
        React.createElement('div', { className: 'migration-guide-section' },
          React.createElement('h3', null, 
            React.createElement('i', { className: 'lni lni-book', style: { marginRight: '8px' } }),
            'Docker Migration Guides'
          ),
          React.createElement('div', { className: 'migration-cards' },
            // vDisk to Folder Guide
            React.createElement('div', { className: 'migration-card' },
              React.createElement('h4', null, '🔄 vDisk → Folder Migration'),
              React.createElement('p', { className: 'migration-desc' }, 'Convert your Docker containers from vdisk.img to folder-based storage'),
              React.createElement('div', { className: 'pros-cons' },
                React.createElement('div', { className: 'pros' },
                  React.createElement('strong', null, '✅ Pros:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Better performance'),
                    React.createElement('li', null, 'Easier backups'),
                    React.createElement('li', null, 'No size limits'),
                    React.createElement('li', null, 'Direct file access')
                  )
                ),
                React.createElement('div', { className: 'cons' },
                  React.createElement('strong', null, '⚠️ Cons:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Requires migration time'),
                    React.createElement('li', null, 'Need free space'),
                    React.createElement('li', null, 'Risk if not backed up')
                  )
                )
              ),
              React.createElement('button', {
                className: 'migration-button',
                onClick: () => window.open('/static/vdisk-to-folder.html', '_blank')
              }, '📖 View Guide')
            ),
            // Folder to vDisk Guide
            React.createElement('div', { className: 'migration-card' },
              React.createElement('h4', null, '🔄 Folder → vDisk Migration'),
              React.createElement('p', { className: 'migration-desc' }, 'Convert your Docker containers from folder-based to vdisk.img storage'),
              React.createElement('div', { className: 'pros-cons' },
                React.createElement('div', { className: 'pros' },
                  React.createElement('strong', null, '✅ Pros:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Single file simplicity'),
                    React.createElement('li', null, 'Easier to move'),
                    React.createElement('li', null, 'Contained environment')
                  )
                ),
                React.createElement('div', { className: 'cons' },
                  React.createElement('strong', null, '⚠️ Cons:'),
                  React.createElement('ul', null,
                    React.createElement('li', null, 'Size limitations'),
                    React.createElement('li', null, 'Slower performance'),
                    React.createElement('li', null, 'Harder to backup'),
                    React.createElement('li', null, 'No direct file access')
                  )
                )
              ),
              React.createElement('button', {
                className: 'migration-button',
                onClick: () => window.open('/static/folder-to-vdisk.html', '_blank')
              }, '📖 View Guide')
            )
          ),
          React.createElement('div', { className: 'migration-note' },
            React.createElement('strong', null, '💡 Tip: '),
            React.createElement('span', null, 'Always create a backup before migrating! Use the backup feature above.')
          )
        )
      ) : null,
      activeTab === 'templates' ? React.createElement('div', { className: 'templates' },
        // No section header - actions moved to top bar
        // Search and Filter Bar
        React.createElement('div', { className: 'filter-bar' },
          React.createElement('div', { className: 'search-box' },
            React.createElement('input', {
              type: 'text',
              placeholder: '🔍 Search templates...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: 'search-input'
            }),
            searchTerm && React.createElement('button', {
              onClick: () => setSearchTerm(''),
              className: 'clear-search',
              title: 'Clear search'
            }, '✕')
          ),
          React.createElement('div', { className: 'filter-controls' },
            React.createElement('select', {
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'all' }, 'All Templates'),
              React.createElement('option', { value: 'matched' }, '✓ Matched Only'),
              React.createElement('option', { value: 'unmatched' }, '✗ Unused Only')
            ),
            React.createElement('select', {
              value: sortBy,
              onChange: (e) => setSortBy(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'name' }, 'Sort: Name'),
              React.createElement('option', { value: 'size' }, 'Sort: Size'),
              React.createElement('option', { value: 'date' }, 'Sort: Date')
            )
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
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleTemplateSort('status'),
                  style: { cursor: 'pointer' }
                }, 
                  'Status ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(templateSortBy, 'status', templateSortOrder)
                  )
                ),
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleTemplateSort('name'),
                  style: { cursor: 'pointer' }
                }, 
                  'Template ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(templateSortBy, 'name', templateSortOrder)
                  )
                ),
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleTemplateSort('container'),
                  style: { cursor: 'pointer' }
                }, 
                  'Container ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(templateSortBy, 'container', templateSortOrder)
                  )
                ),
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleTemplateSort('size'),
                  style: { cursor: 'pointer' }
                }, 
                  'Size ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(templateSortBy, 'size', templateSortOrder)
                  )
                ),
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleTemplateSort('date'),
                  style: { cursor: 'pointer' }
                }, 
                  'Modified ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(templateSortBy, 'date', templateSortOrder)
                  )
                )
              )
            ),
            React.createElement('tbody', null,
              getFilteredAndSortedTemplates().map(template => React.createElement(React.Fragment, { key: template.filename },
                // Main template row
                React.createElement('tr', { 
                className: `${template.matched ? '' : 'unused'} ${selectedRow === template.filename ? 'selected-row' : ''}`,
                onClick: () => setSelectedRow(selectedRow === template.filename ? null : template.filename),
                style: { cursor: 'pointer' }
              },
                React.createElement('td', { className: 'checkbox-cell' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedTemplates.includes(template.filename),
                    onChange: (e) => { e.stopPropagation(); toggleTemplateSelection(template.filename); }
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
                React.createElement('td', null, formatDate(template.modified))
                ),
                // Actions row (only when selected)
                selectedRow === template.filename && React.createElement('tr', { className: 'actions-row' },
                  React.createElement('td', { className: 'checkbox-cell' }, ''), // Empty checkbox cell
                  React.createElement('td', { className: 'actions-cell' },
                React.createElement('div', { className: 'template-actions' },
                    React.createElement('button', { 
                        className: 'btn btn-primary',
                        onClick: (e) => { e.stopPropagation(); handleViewTemplate(template.filename); },
                      title: 'View/Edit template'
                    }, 
                        React.createElement('i', { className: 'lni lni-eye' }),
                        React.createElement('span', { style: { marginLeft: '4px' } }, 'View')
                    ),
                    React.createElement('button', {
                        className: 'btn btn-secondary',
                        onClick: (e) => { e.stopPropagation(); handleRenameTemplate(template.filename); },
                      title: 'Rename template'
                    }, 
                        React.createElement('i', { className: 'lni lni-pencil' }),
                      React.createElement('span', { style: { marginLeft: '4px' } }, 'Rename')
                    ),
                    React.createElement('button', {
                        className: 'btn btn-secondary',
                        onClick: (e) => { e.stopPropagation(); handleCloneTemplate(template.filename); },
                      title: 'Clone template'
                    }, 
                        React.createElement('i', { className: 'lni lni-files' }),
                      React.createElement('span', { style: { marginLeft: '4px' } }, 'Clone')
                    ),
                    React.createElement('button', {
                        className: 'btn btn-danger',
                        onClick: (e) => { e.stopPropagation(); handleDeleteTemplate(template.filename); },
                      title: 'Delete template'
                    }, 
                        React.createElement('i', { className: 'lni lni-trash-can' }),
                      React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete')
                    )
                  )
                  ),
                  React.createElement('td', null, ''), // Empty container cell
                  React.createElement('td', null, ''), // Empty size cell
                  React.createElement('td', null, '')  // Empty modified cell
                )
              ))
            )
          )
        )
      ) : null,
      activeTab === 'containers' ? React.createElement('div', { className: 'containers' },
        // No section header - actions moved to top bar
        // Search and Filter Bar
        React.createElement('div', { className: 'filter-bar' },
          React.createElement('div', { className: 'search-box' },
            React.createElement('input', {
              type: 'text',
              placeholder: '🔍 Search containers...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: 'search-input'
            }),
            searchTerm && React.createElement('button', {
              onClick: () => setSearchTerm(''),
              className: 'clear-search',
              title: 'Clear search'
            }, '✕')
          ),
          React.createElement('div', { className: 'filter-controls' },
            React.createElement('select', {
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'all' }, 'All Containers'),
              React.createElement('option', { value: 'running' }, '🟢 Running Only'),
              React.createElement('option', { value: 'stopped' }, '🔴 Stopped Only')
            ),
            React.createElement('select', {
              value: containerSortBy,
              onChange: (e) => setContainerSortBy(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'name' }, 'Sort: Name'),
              React.createElement('option', { value: 'image' }, 'Sort: Image'),
              React.createElement('option', { value: 'state' }, 'Sort: State')
            )
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
                        setSelectedContainers(containers.map(c => c.id));
                      } else {
                        setSelectedContainers([]);
                      }
                    },
                    checked: selectedContainers.length === containers.length && containers.length > 0
                  })
                ),
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleContainerSort('name'),
                  style: { cursor: 'pointer' }
                }, 
                  'Name ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(containerSortBy, 'name', containerSortOrder)
                  )
                ),
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleContainerSort('image'),
                  style: { cursor: 'pointer' }
                }, 
                  'Image ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(containerSortBy, 'image', containerSortOrder)
                  )
                ),
                React.createElement('th', { 
                  className: 'sortable',
                  onClick: () => handleContainerSort('state'),
                  style: { cursor: 'pointer' }
                }, 
                  'State ',
                  React.createElement('span', { className: 'sort-icon' }, 
                    getSortIcon(containerSortBy, 'state', containerSortOrder)
                  )
                ),
                React.createElement('th', null, 'Template')
              )
            ),
            React.createElement('tbody', null,
              getFilteredAndSortedContainers().map(container => React.createElement(React.Fragment, { key: container.id },
                // Main container row
                React.createElement('tr', { 
                  className: `${selectedContainerRow === container.id ? 'selected-row' : ''}`,
                  onClick: () => setSelectedContainerRow(selectedContainerRow === container.id ? null : container.id),
                  style: { cursor: 'pointer' }
              },
                React.createElement('td', { className: 'checkbox-cell' },
                  React.createElement('input', {
                    type: 'checkbox',
                      checked: selectedContainers.includes(container.id),
                      onChange: (e) => { e.stopPropagation(); toggleContainerSelection(container.id); }
                    })
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
                ),
                // Actions row (only when selected)
                selectedContainerRow === container.id && React.createElement('tr', { className: 'actions-row' },
                  React.createElement('td', { colSpan: 1, className: 'actions-cell' }, ''), // Empty checkbox cell
                  React.createElement('td', null, ''), // Empty name cell
                  React.createElement('td', null, ''), // Empty image cell
                  React.createElement('td', { className: 'actions-cell' },
                React.createElement('div', { className: 'container-actions' },
                      container.state === 'running' ? React.createElement(React.Fragment, null,
                    React.createElement('button', { 
                          className: 'btn btn-primary',
                          onClick: (e) => { e.stopPropagation(); handleContainerAction(container.name, 'stop'); },
                          disabled: loading,
                          title: 'Stop container'
                        }, 
                          React.createElement('i', { className: 'lni lni-stop' }),
                          React.createElement('span', { style: { marginLeft: '4px' } }, 'Stop')
                        ),
                        React.createElement('button', {
                          className: 'btn btn-secondary',
                          onClick: (e) => { e.stopPropagation(); handleContainerAction(container.name, 'restart'); },
                          disabled: loading,
                          title: 'Restart container'
                        }, 
                          React.createElement('i', { className: 'lni lni-reload' }),
                          React.createElement('span', { style: { marginLeft: '4px' } }, 'Restart')
                        )
                      ) : React.createElement('button', {
                        className: 'btn btn-success',
                        onClick: (e) => { e.stopPropagation(); handleContainerAction(container.name, 'start'); },
                        disabled: loading,
                        title: 'Start container'
                      }, 
                        React.createElement('i', { className: 'lni lni-play' }),
                        React.createElement('span', { style: { marginLeft: '4px' } }, 'Start')
                      )
                  )
                  ),
                  React.createElement('td', null, '')  // Empty template cell
                )
              ))
              )
            )
          )
      ) : null,
      activeTab === 'backups' ? React.createElement('div', { className: 'backups' },
        // No section header - actions moved to top bar
        // Search and Filter Bar
        React.createElement('div', { className: 'filter-bar' },
          React.createElement('div', { className: 'search-box' },
            React.createElement('input', {
              type: 'text',
              placeholder: '🔍 Search backups...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: 'search-input'
            }),
            searchTerm && React.createElement('button', {
              onClick: () => setSearchTerm(''),
              className: 'clear-search',
              title: 'Clear search'
            }, '✕')
          ),
          React.createElement('div', { className: 'filter-controls' },
            React.createElement('select', {
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'all' }, 'All Backups'),
              React.createElement('option', { value: 'recent' }, '📅 Recent Only'),
              React.createElement('option', { value: 'large' }, '📦 Large Only')
            ),
            React.createElement('select', {
              value: backupSortBy,
              onChange: (e) => setBackupSortBy(e.target.value),
              className: 'filter-select'
            },
              React.createElement('option', { value: 'name' }, 'Sort: Name'),
              React.createElement('option', { value: 'date' }, 'Sort: Date'),
              React.createElement('option', { value: 'size' }, 'Sort: Size')
            )
          )
        ),
        loading ? React.createElement('div', { className: 'loading' }, 'Loading...') : 
        backups.length === 0 ? 
          React.createElement('div', { className: 'empty-state' },
            React.createElement('p', null, 'No backups yet. Create your first backup to get started.'),
            React.createElement('button', { 
              className: 'btn btn-primary',
              onClick: handleCreateBackup, 
              disabled: loading 
            }, 
              React.createElement('i', { className: 'lni lni-cloud-upload' }),
              React.createElement('span', { style: { marginLeft: '4px' } }, 'Create Backup')
            )
          ) :
          React.createElement('div', { className: 'table-container' },
            React.createElement('table', null,
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', { style: { width: '40px' } }, 
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: selectedBackups.length === getFilteredAndSortedBackups().length && getFilteredAndSortedBackups().length > 0,
                      onChange: (e) => {
                        if (e.target.checked) {
                          setSelectedBackups(getFilteredAndSortedBackups().map(b => b.name));
                        } else {
                          setSelectedBackups([]);
                        }
                      }
                    })
                  ),
                  React.createElement('th', { 
                    className: 'sortable',
                    onClick: () => handleBackupSort('name'),
                    style: { cursor: 'pointer' }
                  }, 
                    'Backup Name ',
                    React.createElement('span', { className: 'sort-icon' }, 
                      getSortIcon(backupSortBy, 'name', backupSortOrder)
                    )
                  ),
                  React.createElement('th', { 
                    className: 'sortable',
                    onClick: () => handleBackupSort('date'),
                    style: { cursor: 'pointer' }
                  }, 
                    'Created ',
                    React.createElement('span', { className: 'sort-icon' }, 
                      getSortIcon(backupSortBy, 'date', backupSortOrder)
                    )
                  ),
                  React.createElement('th', { 
                    className: 'sortable',
                    onClick: () => handleBackupSort('size'),
                    style: { cursor: 'pointer' }
                  }, 
                    'Size ',
                    React.createElement('span', { className: 'sort-icon' }, 
                      getSortIcon(backupSortBy, 'size', backupSortOrder)
                    )
                  ),
                  React.createElement('th', { 
                    className: 'sortable',
                    onClick: () => handleBackupSort('containers'),
                    style: { cursor: 'pointer' }
                  }, 
                    'Containers ',
                    React.createElement('span', { className: 'sort-icon' }, 
                      getSortIcon(backupSortBy, 'containers', backupSortOrder)
                    )
                  ),
                  React.createElement('th', { 
                    className: 'sortable',
                    onClick: () => handleBackupSort('templates'),
                    style: { cursor: 'pointer' }
                  }, 
                    'Templates ',
                    React.createElement('span', { className: 'sort-icon' }, 
                      getSortIcon(backupSortBy, 'templates', backupSortOrder)
                    )
                  )
                )
              ),
              React.createElement('tbody', null,
                getFilteredAndSortedBackups().map(backup => React.createElement(React.Fragment, { key: backup.name },
                  React.createElement('tr', { 
                    onClick: () => setSelectedBackupRow(selectedBackupRow === backup.name ? null : backup.name),
                    style: { cursor: 'pointer' }
                  },
                    React.createElement('td', { onClick: (e) => e.stopPropagation() },
                      React.createElement('input', {
                        type: 'checkbox',
                        checked: selectedBackups.includes(backup.name),
                        onChange: () => toggleBackupSelection(backup.name)
                      })
                    ),
                    React.createElement('td', null,
                      React.createElement('strong', null, backup.name)
                    ),
                    React.createElement('td', null, formatDate(backup.created)),
                    React.createElement('td', null, formatBytes(backup.size)),
                    React.createElement('td', null, backup.container_count || 0),
                    React.createElement('td', null, backup.template_count || 0)
                  ),
                  selectedBackupRow === backup.name && React.createElement('tr', { className: 'actions-row' },
                    React.createElement('td', { colSpan: 6, className: 'actions-cell' },
              React.createElement('div', { className: 'backup-actions' },
                React.createElement('button', { 
                          className: 'btn btn-primary',
                  onClick: () => handleRestoreBackup(backup.name),
                          disabled: loading,
                          title: 'Restore backup'
                }, 
                  React.createElement('i', { className: 'lni lni-reload' }),
                  React.createElement('span', { style: { marginLeft: '4px' } }, 'Restore')
                ),
                React.createElement('button', { 
                          className: 'btn btn-danger',
                  onClick: () => handleDeleteBackup(backup.name),
                          disabled: loading,
                          title: 'Delete backup'
                }, 
                  React.createElement('i', { className: 'lni lni-trash-can' }),
                  React.createElement('span', { style: { marginLeft: '4px' } }, 'Delete')
                        )
                      )
                )
              )
            ))
          )
        )
          )
      ) : null
      ),
    // Close content-wrapper
      ),
      // Footer
      !showApiKeyPrompt && React.createElement('footer', { className: 'app-footer' },
        React.createElement('div', { className: 'footer-content' },
          React.createElement('div', { className: 'footer-left' },
            React.createElement('span', { className: 'footer-text' }, 
              'Docker Template Manager v', version?.version || 'Loading...'
            )
          ),
          React.createElement('div', { className: 'footer-center' },
            updateInfo?.update_available && React.createElement('div', { className: 'update-notification' },
              React.createElement('i', { className: 'lni lni-arrow-up' }),
              React.createElement('span', null, 'Update Available: v', updateInfo.latest_version),
              React.createElement('button', {
                className: 'btn btn-sm btn-primary',
                onClick: () => window.open(updateInfo.release_url, '_blank')
              }, 'View Release')
            )
          ),
          React.createElement('div', { className: 'footer-right' },
            React.createElement('button', {
              className: 'btn btn-sm btn-secondary',
              onClick: checkForUpdates,
              disabled: checkingUpdates,
              title: 'Check for updates'
            },
              checkingUpdates ? 
                React.createElement('i', { className: 'lni lni-spinner-arrow' }) :
                React.createElement('i', { className: 'lni lni-reload' }),
              React.createElement('span', { style: { marginLeft: '4px' } }, 
                checkingUpdates ? 'Checking...' : 'Check Updates'
              )
            )
          )
        )
      ),
      // Mobile Menu Button
      !showApiKeyPrompt && React.createElement('button', {
        className: 'mobile-menu-button',
        onClick: () => setMobileMenuOpen(!mobileMenuOpen)
      }, mobileMenuOpen ? '✕' : '☰')
  );
}

// Export for global access
window.App = App;