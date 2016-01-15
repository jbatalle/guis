var resources = {
    "id": "resources list",
    resources: [
        {
            x: 350,
            y: 250,
            id: "OFSwitch-23",
            type: "ofswitch",
            ports: [{
                    id: "OF11"
                },
                {
                    id: "OF12"
                },
                {
                    id: "OF13"
                }]
        },
        {
            x: 500,
            y: 250,
            id: "Tson-24",
            type: "tson",
            endpoint: "http://137.222.177.116:8080",
            ports: [{
                id: "T11"
                            }, {
                id: "T12"
                            }, {
                id: "T13"
                            }]
        },
        {
            x: 600,
            y: 100,
            id: "Tson-26",
            type: "tson",
            ports: [{
                id: "T21"
                            }, {
                id: "T22"
                            }]

        },
        {
            x: 650,
            y: 250,
            id: "Tson-25",
            type: "tson",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]

        },
        {
            x: 250,
            y: 350,
            id: "EPC-20",
            type: "epc",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 200,
            y: 300,
            id: "LTE-21",
            type: "lte",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 200,
            y: 400,
            id: "LTE-22",
            type: "lte",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 200,
            y: 100,
            id: "WNODE-14",
            type: "wifi",
            ports: [{
                id: "CHANNEL-1"
                            }]
        },
        {
            x: 100,
            y: 100,
            id: "WNODE-15",
            type: "wifi",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 100,
            y: 200,
            id: "WNODE-16",
            type: "wifi",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 200,
            y: 200,
            id: "WNODE-17",
            type: "wifi",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 100,
            y: 300,
            id: "WNODE-18",
            type: "wifi",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 100,
            y: 400,
            id: "WNODE-19",
            type: "wifi",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        {
            x: 100,
            y: 150,
            id: "WNODE-9",
            type: "wifi",
            ports: [{
                id: "T31"
                            }, {
                id: "T32"
                            }]
        },
        ],
    links: [
        {
            srcPort: "T11",
            dstPort: "OF11"
                    },
        {
            srcPort: "OF12",
            dstPort: "OF21"
                    },
        {
            srcPort: "OF22",
            dstPort: "OF31"
                    },
        {
            srcPort: "OF32",
            dstPort: "OF13"
                    },
        {
            srcPort: "T12",
            dstPort: "T21"
                    },
        {
            srcPort: "T22",
            dstPort: "T31"
                    },
        {
            srcPort: "T32",
            dstPort: "T13"
        }
    ]
}
