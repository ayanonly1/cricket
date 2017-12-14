# Tables that we need to create

### Event : stores all teh datails for each event
* id
* Descriotion
* Yes_bid
* No_bod
* Open_time
* Close_time
* Status 
  * Open: open for bidding
  * Closed: Closed for bidding
  * Dicleared: result decleared
* 

### Bid
* id
* user_id
* event_id
* amount
* Result
  * True: decleared
  * False: yet not decleared
* Bid_on:
  * True: This bid is for yes result
  * False: this bid is for false result
* Time: When the bid placed

### User
* id
* email
* name
* Balence
* isAdmin: [true / false]


### Transactions
* id
* userid
* amount
* time
* bid_id
* admin_id