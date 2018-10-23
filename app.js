var subscriberListApp = angular.module('subscriberListApp', []);

class Person {
    constructor(id, name, email, phone, address, subscription) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.subscription = subscription;
    }

    toString() {
        return `${this.name.toString()} ${this.email} ${this.phone} ${this.address.toString()} ${this.subscription.toString()}`
    }
}
class Subscription {
  constructor(subscriptionType, subscriptionCost, monthsOfSupscription) {
    this.subscriptionType = subscriptionType;
    this.subscriptionCost = subscriptionCost;
    this.monthsOfSupscription = monthsOfSupscription;
  }
  toString() {
    return `${this.subscriptionType}, ${this.subscriptionCost}, ${this.monthsOfSupscription}`
  }
}

class Name {
    constructor(firstName, lastName) {
        this.firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        this.lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    }

    toString() {
        return `${this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1)} ${this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1)}`
    }
}

class Location {
    constructor(city, postcode, street) {
        this.city = city;
        this.postcode = postcode;
        this.street = street;
    }

    toString() {
        return `${this.postcode}, ${this.city}, ${this.street}`
    }
}

subscriberListApp.filter('filterSubscribers', function() {
    return function(subscribers, letter) {
        if (letter === undefined) {
            return subscribers;
        }
        return subscribers.filter(function(subscriber) {
            return subscriber.toString().toLowerCase().includes(letter);
        });
    }
});



subscriberListApp.controller('SubscriberListController', function SubscriberListController($scope) {
    $scope.randomUserToPerson = function(user) {
        var monthlySubscription = ("Monthly Subscription", 450)
        var yearlySubscription = ("Yearly Subscription", 4860)
        var subscriptionsCosts = [monthlySubscription, yearlySubscription]
        var subscriptionCost = user.subscription ? user.subscription : subscriptionsCosts[Math.floor(Math.random()*subscriptionsCosts.length)]
      //  var subscription = (user.subscription.subscriptionCost)
        var name = new Name(user.name.first, user.name.last);
        var location = new Location(user.location.city, user.location.postcode, user.location.street)
        var person = new Person(user.login.username, name, user.email, user.phone, location, subscriptionCost);
        return person;
    };

    $scope.getSubscriptionPrice = function (user) {
        var subscriptionType = user.subscription;
        if (subscriptionType === "One month subscription")
        return 450;
        else return 4860;
    }

    $scope.subscribers = [];

    $scope.hideOnDesktop = function() {
     if(window.innerWidth <= 800) {
       return false;
     } else {
       return true;
     }
  }

  $scope.hideOnPhone = function() {
   if(window.innerWidth <= 800) {
     return true;
   } else {
     return false;
   }
}

    $scope.loadData = function() {
        var numberOfSubscribers = Math.floor(Math.random() * (40 - 20) + 20);
        $.ajax({
            url: `https://randomuser.me/api/?nat=dk,gb,us&inc=name,phone,email,location,login,nat&results=${numberOfSubscribers}`,
            dataType: 'json',
            success: function(r) {
                var data = r.results.map($scope.randomUserToPerson);
                $scope.subscribers = data;
                $scope.$apply();
            }
        });
    };
    $scope.fieldValidation = function(key) {
        return $scope.addUserForm[key].$invalid;
    };
    $scope.addSubscriber = function(user) {
        user.subscription = $scope.getSubscriptionPrice(user)
        $scope.subscribers.push($scope.randomUserToPerson(user));
        $scope.user = {};
    };
    $scope.removeSubscriber = function(id) {
        if (confirm("Are you sure you want to remove thesubscriber?\nThis action is irreversible and you will have to add him back manually!"))
            for (var i = 0; i < $scope.subscribers.length; i++)
                if ($scope.subscribers[i].id.toLowerCase() === id.toLowerCase())
                    $scope.subscribers.splice(i, 1);
    }

    $scope.totalMonthlySubscriptions = function() {
      var subscriptions = [];
      for (var i = 0; i < $scope.subscribers.length; i++)
        if($scope.subscribers[i].subscription === 450)
          subscriptions.push($scope.subscribers[i].subscription);
      return (subscriptions.length) ? subscriptions.reduce(function(sum, value) { return sum + value; }) : 0;
  };

  $scope.getNumberOfMonthlySubscriptions = function() {
      var subscriptions = [];
      for (var i = 0; i < $scope.subscribers.length; i++)
        if($scope.subscribers[i].subscription === 450)
          subscriptions.push($scope.subscribers[i].subscription);
          return subscriptions.length;
  }

  $scope.totalYearlySubscriptions = function() {
    var subscriptions = [];
    for (var i = 0; i < $scope.subscribers.length; i++)
      if($scope.subscribers[i].subscription > 450)
        subscriptions.push($scope.subscribers[i].subscription);
    return (subscriptions.length) ? subscriptions.reduce(function(sum, value) { return sum + value; }) : 0;
};

$scope.getNumberOfYearlySubscriptions = function() {
    var subscriptions = [];
    for (var i = 0; i < $scope.subscribers.length; i++)
      if($scope.subscribers[i].subscription > 450)
        subscriptions.push($scope.subscribers[i].subscription);
        return subscriptions.length;
}




});
