
/**
 * @class Ext.ux.mantis.model.Ticket
 * 
 */
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

    appOptions: {},

    proxy: {
        type: 'rest',
        url: 'api/rest/issues',
        useDefaultXhrHeader: false,
        limitParam: 'page_size',
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
        var me = this,
            version = '';
        if (!me.appOptions.noVersion) {
            version = Ext.manifest.version;
            if (me.appOptions.versionIsPatchX === true) {
                version = version.substring(0, version.lastIndexOf("."));
                version = version + ".x";
            }
        }
        return version;
    },
    
    // eslint-disable-next-line consistent-return
    save: function(options)
    {
        var me = this;

        if (!me.appOptions.token || !me.appOptions.project_id) {
            return false;
        }
        
        if (me.phantom) {
            me.set('created_at', new Date());
            me.set('project', { id: me.appOptions.project_id });
            if (!me.appOptions.noVersion) {
                me.set('version', { name: me.getVersion() });
            }
            if (me.appOptions.defaultTicketValues.custom_fields) {
                me.set('custom_fields', me.appOptions.defaultTicketValues.custom_fields);
            }
        }

        var proxy = me.getProxy();
        proxy.setHeaders(
        {
            Authorization: me.appOptions.token
        });

        var url = proxy.getUrl();
        if (url.indexOf(me.appOptions.location) === -1) {
            proxy.setUrl(me.appOptions.location + url);
        }
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
        reference: 
        {
            type: 'Ext.ux.mantis.model.Priority',
            role: 'priority',
            unique: true
        }
    },
    { 
        name: 'project',
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
