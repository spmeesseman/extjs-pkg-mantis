
Ext.define('Ext.ux.mantis.Changelog', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'mantischangelog',
    
    require: [
    ],
    
    reference: 'mantischangelog',
    scrollable: true,
    	
    config:
    {
        closeFn: false,
        version: undefined
    },

    publishes:
    {
        closeFn: true,
        version: true
    },

    twoWayBindable:
    {
        version: true
    },

    layout: 
    {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },

    viewModel:
    {
        data:
        {
            versions: undefined
        },

        stores:
        {
            versionStore:
            {
                type: 'array',
                fields:[ { name:'dsc' } ],
                data : '{versionArrays}'
            }
        },

        formulas:
        {
            versionArrays: 
            {
                get: function(get) 
                {
                    var arr = [];
                    var versions = get('versions');
                    for (var v in versions)
                    {
                        arr.push([versions[v]]);
                    }
                    return arr;
                }
            },

            prevVersionDisabled: 
            {
                get: function(get) 
                {
                    var versions = get('versions');
                    if (versions && versions.length > 0)
                    {
                        return versions[versions.length - 1] === get('mantischangelog.version');
                    }
                    return true;
                }
            },

            nextVersionDisabled: 
            {
                get: function(get) 
                {
                    var versions = get('versions');
                    if (versions && versions.length > 0)
                    {
                        return versions[0] === get('mantischangelog.version');
                    }
                    return true;
                }
            }
        }
    },

    listeners:
    {
        afterrender: function(panel)
        {
            Ext.create('Ext.util.DelayedTask', function()
            {
                var vm = panel.getViewModel();
                var mask = ToolkitUtils.mask(panel, 'Loading mantis changelog');

                //
                // Build utility version cache first
                //
                MantisUtils.buildVersionCache()
                .then(function(cache)
                {
                    //
                    // Now get changelog for the current version
                    //
                    vm.set('versions', cache);
                    return panel.getChangeLog();
                })
                .then(function(cache)
                {
                    ToolkitUtils.unmask(mask);
                })
                .catch(function(obj)
                {
                    ToolkitUtils.unmask(mask);
                    Utils.alertError("Error retrieving changelog<br><br>" + obj.reason);
                });
            }, panel).delay(100);
        }
    },
    
    items: [
    {
        bind:
    	{
            html: '{content}',
            title: 'Version {version}'
    	}
    }],
    
    buttons: [
    {
        xtype: 'combo',
        fieldLabel: 'Version',
        displayField: 'dsc',
        valueField: 'dsc',
        editable: false,
        width: 130,
        labelWidth: 45,
        margin: '0 15 0 0',
        queryMode: 'local',
        bind:
        {
            value: '{mantischangelog.version}',
            store: '{versionStore}'
        },
        listeners:
        {
            select: function(cmb)
            {
                cmb.up('mantischangelog').setVersion(cmb.getValue());
                cmb.up('mantischangelog').getChangeLog();
            }
        }
    },
    {
        text: 'Previous',
        iconCls: 'far fa-hand-point-left',
        bind:
        {
            disabled: '{prevVersionDisabled}'
        },
        handler: function(btn, eopts)
        {
            var panel = btn.up('mantischangelog');
            panel.setVersion(MantisUtils.getVersionPrevious(panel.getVersion()));
            panel.getChangeLog();
        }
    },
    {
        text: 'Next',
        disabeld: true,
        iconCls: 'far fa-hand-point-right',
        bind:
        {
            disabled: '{nextVersionDisabled}'
        },
        handler: function(btn, eopts)
        {
            var panel = btn.up('mantischangelog');
            panel.setVersion(MantisUtils.getVersionNext(panel.getVersion()));
            panel.getChangeLog();
        }
    },
    {
        text: 'Close',
        iconCls: 'far fa-times',
        hidden: true,
        bind:
        {
            hidden: '{!mantischangelog.closeFn}'
        },
        handler: function(btn, eopts)
        {
        	btn.up('mantischangelog').getCloseFn()(btn, eopts);
        }
    }],

    getChangeLog: function()
    {
        var me = this;
        var vm = me.getViewModel();
        //
        // Default to current extjs version if not set in vm
        //
        if (!me.getVersion() && vm.get('versionArrays')[0]) {
            me.setVersion(Ext.manifest.version); 
        }
        //
        // Get changelog for the version set in the view model
        //
        return new Ext.Promise(function(resolve, reject)
        {
            var mask = ToolkitUtils.mask(me, 'Loading mantis changelog');
            MantisUtils.getChangeLog(me.getVersion())
            .then((content) =>
            {
                me.getViewModel().set('content', content);
                resolve();
            })
            .catch((obj) => { reject(obj); })
            .finally(() =>  { ToolkitUtils.unmask(mask); });
        });
    }
    
});
