var resources = {
    "id": "resources list",
    resources: [
        {
            x: 350,
            y: 250,
            id: "OFSwitch-23",
            type: "OFSWITCH",
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
            type: "TSON",
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
            type: "TSON",
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
            type: "TSON",
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
            type: "EPC",
            ports: [
                {
                    id: "E01"
                },
                {
                    id: "E02"
                },
                {
                    id: "E03"
                }
            ]
        },
        {
            x: 200,
            y: 300,
            id: "LTE-21",
            type: "LTE",
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
            type: "LTE",
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
            type: "wnode",
            ports: [{
                id: "CHANNEL-1"
                            }]
        },
        {
            x: 100,
            y: 100,
            id: "WNODE-15",
            type: "wnode",
            ports: [
                {
                    id: "if0"
                }, {
                    id: "if1"
                }
            ]
        },
        {
            x: 100,
            y: 200,
            id: "WNODE-16",
            type: "wnode",
            ports: [
                {
                    id: "if0"
                }, {
                    id: "if1"
                }
            ]
        },
        {
            x: 200,
            y: 200,
            id: "WNODE-17",
            type: "wnode",
            ports: [
                {
                    id: "if0"
                }, {
                    id: "if1"
                }
            ]
        },
        {
            x: 100,
            y: 300,
            id: "WNODE-18",
            type: "wnode",
            ports: [
                {
                    id: "if0"
                }, {
                    id: "if1"
                }
            ]
        },
        {
            x: 100,
            y: 400,
            id: "WNODE-19",
            type: "wnode",
            ports: [
                {
                    id: "if0"
                }, {
                    id: "if1"
                }
            ]
        },
        {
            x: 100,
            y: 150,
            id: "WNODE-9",
            type: "wnode",
            ports: [
                {
                    id: "if0"
                }, {
                    id: "if1"
                }
            ]
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
