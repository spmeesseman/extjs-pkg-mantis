
Ext.define('Ext.ux.mantis.model.Ticket', 
{
    extend: 'Ext.data.Model',    
    alias: 'mantis.model.ticket',
    
    requires: [
        'Ext.ux.mantis.model.Category',
        'Ext.ux.mantis.model.Note',
        'Ext.ux.mantis.model.Priority',
        'Ext.ux.mantis.model.Project',
        'Ext.ux.mantis.model.Reproducibility',
        'Ext.ux.mantis.model.Severity',
        'Ext.ux.mantis.model.Version',
        'Ext.ux.mantis.model.ViewState'
    ],

    proxy: {
        type: 'rest',
        url: Ext.manifest.mantis.location ? Ext.manifest.mantis.location + 'api/rest/issues' : '',
        useDefaultXhrHeader: false,
        limitParam: 'page_size',
        headers:
        {
            Authorization: Ext.manifest.mantis.token
        },
        reader:
        {
            type: 'json',
            rootProperty: 'issue'
        },
        writer:
        {
            allDataOptions:
            {
                //critical: true,
                //changes: true,    
                persist: true,     // Default
                associated: true,  // Override default false
                associatedSave: true     // Custom  (See override Model.js)
            },
            partialDataOptions:
            {
                changes: true,     // Default
                critical: true,    // Default
                associated: true,  // Override default false,
                droppedAssociated: true, // Custom (See override Model.js)
                associatedSave: true     // Custom  (See override Model.js)
            }
        }
    },

    getVersion: function()
    {
        var version = Ext.manifest.version;
        if (Ext.manifest.mantis.versionIsPatchX === true) {
            version = version.substring(0, version.lastIndexOf("."));
            version = version + ".x";
        }
        return version;
    },

    // eslint-disable-next-line consistent-return
    save: function(options)
    {
        var me = this;

        if (!Ext.manifest.mantis.token || !Ext.manifest.mantis.project_id) {
            return false;
        }
        
        if (me.phantom) {
            me.set('created_at', new Date());
            me.set('project', { id: Ext.manifest.mantis.project_id });
            me.set('version', { name: me.getVersion() });
            if (Ext.manifest.mantis.defaultTicketValues.custom_fields) {
                me.set('custom_fields', Ext.manifest.mantis.defaultTicketValues.custom_fields);
            }
        }

        me.getProxy().setHeaders(
        {
            Authorization: Ext.manifest.mantis.token
        });

        //
        // Proceed to parent save()
        //
        me.callParent([options]);
    },

    fields: [
    { name: 'id' },
    { name: 'created_at',    type: 'date',   dateFormat: 'Y-m-dTH:i:s-u:00' },
    { name: 'updated_at',    type: 'date',   dateFormat: 'Y-m-dTH:i:s-u:00' },
    { name: 'sticky',        type: 'boolean' },
    { name: 'summary',       type: 'string'  },
    { name: 'description',   type: 'string'  },
    { 
        name: 'steps_to_reproduce',
        type: 'string'  
    },
    { 
        name: 'additional_information',
        type: 'string'  
    },{ 
        name: 'category',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.category : 1,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Category',
            role: 'category',
            unique: true
        }
    },
    { 
        name: 'custom_fields' // many-to-one
    },
    { 
        name: 'handler'
    },
    { 
        name: 'notes' // many-to-one
    },
    { 
        name: 'priority',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.priority : 30,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Priority',
            role: 'priority',
            unique: true
        }
    },
    { 
        name: 'project',
        defaultValue: Ext.manifest.mantis.project_id,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Project',
            role: 'project',
            unique: true
        }
    },
    { 
        name: 'reporter'
    },
    { 
        name: 'reproducibility',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.reproducibility : 70,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Reproducibility',
            role: 'reproducibility',
            unique: true
        }
    },
    { 
        name: 'resolution'
    },
    { 
        name: 'severity',
        defaultValue: Ext.manifest.mantis && Ext.manifest.mantis.defaultTicketValues ? Ext.manifest.mantis.defaultTicketValues.severity : 50,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Severity',
            role: 'severity',
            unique: true
        }
    },
    { 
        name: 'status'
    },
    { 
        name: 'tags'
    },
    { 
        name: 'target_version'
    },
    { 
        name: 'version',
        defaultValue: Ext.manifest.version,
        reference: 
        {
            type: 'Ext.ux.mantis.model.Version',
            role: 'version',
            unique: true
        }
    },
    { 
        name: 'view_state',
        reference: 
        {
            type: 'Ext.ux.mantis.model.ViewState',
            role: 'view_state',
            unique: true
        }
    },
    { 
        name: 'history' 
    },
    {
        name: 'shortDescription', 
        convert: function(v, rec) 
        {
            if (rec.get('description') && rec.get('description').length > 300) {
                return rec.get('description').substring(0, 300) + '...';
            }
            return rec.get('description');
        },
        depends: ['description'],
        persist: false
    }]

});
