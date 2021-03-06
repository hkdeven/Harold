import $ from "jquery";
import publish from "../../core/decorators/publish";
import User from "./user";

export default class LoginManager {
  constructor() {
    this.statusUrl = "https://auth.lonelyplanet.com/users/status.json";
    this.feedUrl = "https://www.lonelyplanet.com/thorntree/users/feed";
    
    this.checkStatus();
  }
  /**
   * Check to see if the user is currently logged in.
   * @return {jQuery.Deferred}
   */
  checkStatus() {
    return $.ajax({
      url: this.statusUrl,
      dataType: "jsonp",
      success: this.statusFetched.bind(this),
      error: this.error.bind(this)
    });
  }
  /**
   * Callback from checking the user's login status.
   * If the user is not logged in, it will publish a user with a null id.
   * Will check for user notifications if the user is logged in.
   * @param  {Object} user User login information
   */
  statusFetched(user) {
    this.user = (user.username ? new User(user) : new User());
    
    if (!user.id) {
      return this._updateStatus();
    }

    this._updateStatus();
  }
  
  @publish("user.status.update")
  _updateStatus() {
    return this.user.toJSON();
  }
  
  error() {
    throw "Error retrieving luna login information";
  }
}
