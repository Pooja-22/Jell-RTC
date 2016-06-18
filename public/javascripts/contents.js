{
    "contents"
:
    [{
        "channels": [{
            "endpoint": "91e8cd99",
            "channel-bundle-id": "91e8cd99",
            "sources": [3369006874],
            "rtp-level-relay-type": "translator",
            "expire": 60,
            "initiator": true,
            "ssrcs": [2410103823, 3361738129],
            "id": "38f110d471e1f3e8",
            "direction": "sendrecv"
        }, {
            "endpoint": "61316d44",
            "channel-bundle-id": "61316d44",
            "sources": [3369006874],
            "rtp-level-relay-type": "translator",
            "expire": 60,
            "initiator": true,
            "ssrcs": [4108245139, 3804386695],
            "id": "a735c506310842aa",
            "direction": "sendrecv"
        }],
        "name": "audio"
    },
        {
        "channels":
            [{
            "endpoint": "91e8cd99",
            "channel-bundle-id": "91e8cd99",
            "sources": [2535127987],
            "rtp-level-relay-type": "translator",
            "expire": 60,
            "initiator": true,
            "ssrcs": [523242756, 4068652014],
            "simulcast-mode": "REWRITING",
            "id": "108c9d15ba951037",
            "receive-simulcast-layer": null,
            "direction": "sendrecv",
            "last-n": -1
        }, {
            "endpoint": "61316d44",
            "channel-bundle-id": "61316d44",
            "sources": [2535127987],
            "rtp-level-relay-type": "translator",
            "expire": 60,
            "initiator": true,
            "ssrcs": [740493515, 1575250627],
            "simulcast-mode": "REWRITING",
            "id": "aecddc378358c7d",
            "receive-simulcast-layer": null,
            "direction": "sendrecv",
            "last-n": -1
        }],
        "name": "video"
    }, {
        "sctpconnections": [{
            "endpoint": "91e8cd99",
            "channel-bundle-id": "91e8cd99",
            "port": 5000,
            "expire": 60,
            "initiator": true,
            "id": "7ea83729bd76ca92"
        }, {
            "endpoint": "61316d44",
            "channel-bundle-id": "61316d44",
            "port": 5000,
            "expire": 60,
            "initiator": true,
            "id": "855b526267501eb5"
        }],
        "name": "data"
    }]
}