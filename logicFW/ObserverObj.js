console.log('load observer.. ');

var publisher = {
    subscribers: {
        any: [] // 구독자 배열
    },
    subscribe: function(fn, type) {
        type = type || 'any';
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn);
    },
    unsubscribe: function(fn, type) {
        this.visitSubscribers('unsubscribe', fn, type);
    },
    publish: function(publication, type) {
        this.visitSubscribers('publish', publication, type);
    },
    visitSubscribers: function(action, arg, type) {
        
        var pubtype = type || 'any';
        var subscribers = this.subscribers[pubtype];
        var max = subscribers.length;
        var i;

        for (i = 0; i < max; i++) {
            if (action === 'publish') {
                subscribers[i](arg);
            } else {
                if (subscribers[i] === arg) {
                    subscribers.splice(i, 1);
                }
            }
        }
    }
};

// 부모 객체를 순회하면 대상객체에 기능을 붙임
function makePublisher(o) {
    var i;
    for (i in publisher) {
        if (publisher.hasOwnProperty(i) &&
            typeof publisher[i] === "function") {
            o[i] = publisher[i];
        }
    }
    o.subscribers = {any: []};
}

var paper = {
    daily: function() {
        this.publish("big new today.");
    },
    monthly: function() {
        this.publish("interesting  analysis", "monthly");
    }
};

// 발행자 만듬
makePublisher(paper);

var joe = {
    drinkCoffee: function(paper) {
        console.log(paper + '를 읽었습니다.(구독자)')
    },
    sundayPreNap: function(monthly) {
        console.log('잠들기전' + monthly + '를 읽었습니다.(구독자)')
    }
}

// 구독자 추가
paper.subscribe(joe.drinkCoffee);
paper.subscribe(joe.sundayPreNap, 'monthly');

// 이벤트 발생
paper.daily();
paper.daily();
paper.daily();
paper.monthly();

