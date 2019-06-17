
Ext.define('Ext.ux.mantis.model.Ticket', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.ticket',
    
    requires: [
        'Ext.ux.mantis.model.Category'
    ],

    proxy: {
        type: 'rest',
        url: 'https://app1.development.pjats.com/projects/api/rest/issues',
        withCredentials: true,
        useDefaultXhrHeader: false,
        headers:
        {
            Authorization: Ext.manifest.mantis.token
        },
        reader:
        {
            type: 'json',
            rootProperty: 'issues'
        }
    },

    fields: [
    { name: 'id',            type: 'number'  },
    { name: 'created_at',    type: 'date',   dateFormat: 'm/d/Y H:i:s' },
    { name: 'sticky',        type: 'boolean' },
    { name: 'summary',       type: 'string'  },
    { name: 'description',   type: 'string'  },
    { name: 'updated_at',    type: 'date',   dateFormat: 'm/d/Y H:i:s' },
    { 
        name: 'categoryid',
        reference: 
        {
            type: 'Ext.ux.mantis.model.Category',
            role: 'category',
            unique: true
        }
    },
    { 
        name: 'custom_fields' 
    },
    { 
        name: 'handler'
    },
    { 
        name: 'notes' 
    },
    { 
        name: 'priority'
    },
    { 
        name: 'project'
    },
    { 
        name: 'reporter'
    },
    { 
        name: 'reporter'
    },
    { 
        name: 'reproducibility'
    },
    { 
        name: 'resolution'
    },
    { 
        name: 'severity'
    },
    { 
        name: 'status'
    },
    { 
        name: 'target_version'
    },
    { 
        name: 'version'
    },
    { 
        name: 'view_state'
    },
    { 
        name: 'history' 
    }]

});
