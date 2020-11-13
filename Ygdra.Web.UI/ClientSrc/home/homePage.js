// @ts-check
import { modalPanel } from "../modal/modalPanel.js";
import { notification } from "../notification.js";
import { auth } from "../auth.js"

export class homePage {

    // singleton
    static _current;

    /** @returns {homePage} */
    static get current() {
        if (!homePage._current)
            homePage._current = new homePage();

        return homePage._current;
    }


    initialize() {
        $(async () => await this.onLoad());
    }

    async onLoad() {

        // Get the notification modal
        this.notifModal = new modalPanel("notif").sm().generate();

        // auto bind with arrow function
        this.notifModal.onShown(e => this.shownPanel(e));
        this.notifModal.onUnLoad(e => this.unloadPanel(e));
        // manual binding for fun
        this.notifModal.onShow(this.showPanel.bind(this));

        this.settingsModal = new modalPanel("settings").lg().generate();

        this.settingsModal.onShown(e => this.shownSettingsPanel(e));
        this.settingsModal.onUnLoad(e => this.unloadSettingsPanel(e));


        //notification.current.on(notification.OnStarted, async () => await console.log("Backend server started."));
        //notification.current.on(notification.OnConnecting, async () => await console.log("Backend server connecting..."));
        //notification.current.on(notification.OnConnected, async () => await console.log("Backend server connected..."));
        //notification.current.on(notification.OnStopped, async () => await console.log("Backend server stopped."));

        // when receiving an order to refresh notifications
        notification.current.on('refresh_notifications', async () => {
            console.log("call to refresh_notifications");
            await this.refreshNotificationsAsync();
        });

        notification.current.start();


        if (auth.current.isAuthenticated) {
            this.settingsModal.body().append(`
                <ul class="settings">
                  <li>
                    <label>
                        <i class="fas fa-th-large"></i>
                        About   
                    </label>
                    <div>Something interesting like... Hey, this is a piece of OSS project, made by Sebastien Pertus</div>
                  </li>
                  <li>
                    <label>
                        <i class="fas fa-cogs"></i>
                        Default Engine   
                    </label>  
                    <select class="mt-2" data-style="btn-outline-dark" data-container="body" data-live-search="true" title="Choose default engine" id="defaultEngineSelect">
                        <option>Mustard</option>
                        <option>Ketchup</option>
                        <option>Relish</option>
                    </select>
                  </li>
                </ul>
            `);

            $('#defaultEngineSelect').selectpicker();

        }
    }


    constructor() {

 

        auth.current.on(auth.OnAuthenticated, async isAuth => {
            if (isAuth)
                await this.refreshNotificationsAsync();
        });

    }

    async dismissNotificationsAsync() {

        // loading notifications
        let url = "/api/notifications";
        let response = await fetch(url, { method: "DELETE" });

        var deleted = response.json();

        if (!deleted)
            return;

        this.notifModal.body().empty();

        await this.refreshNotificationsAsync();
    }

    async refreshNotificationsAsync() {

        // loading notifications
        let url = "/api/notifications";
        let response = await fetch(url);

        if (response.status >= 400) {
            return;
        }

        this.notifications = await response.json();

        this.notifModal.body().empty();

        let bellContent = $('#notif-bell-content');

        if (!this.notifications || this.notifications.length <= 0) {

            bellContent.hide();


            this.notifModal.body().append(`
                    <div class="notif-empty">
                        <div class="notif-empty-body">
                            <i class="far fa-bell"></i>
                        </div>
                        <div class="notif-empty-message">
                            <span>No new notifications, yet.</span>
                        </div>
                    </div>`);

        } else {

            bellContent.show();
            bellContent.text(this.notifications.length.toString());

            for (let notif of this.notifications) {

                let notifUrl = '';
                if (notif.url)
                    notifUrl = `<a href="${notif.url}" class="ml-2 hide-sm"><i class="fas fa-external-link-alt"></i></a>`;

                this.notifModal.body().append(`
                    <div class="notif">
                        <div class="notif-title">
                            <i class="fas fa-check-circle"></i>
                            <span>${notif.title}</span>
                        </div>
                        <div class="notif-message">
                            <span>${notif.message}</span>
                            ${notifUrl}
                        </div >
                    </div > `);
            }
        }

    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var type = button.data('type');

    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    shownSettingsPanel(event) {

        let button = $(event.relatedTarget) // Button that triggered the modal

        let titleString = button.data('title');

        this.settingsModal.submitButton().hide();
        this.settingsModal.title().text(titleString);
        this.settingsModal.deleteButton().hide();
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadSettingsPanel(event) {
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {

        let button = $(event.relatedTarget) // Button that triggered the modal

        let titleString = button.data('title');

        this.notifModal.submitButton().hide();
        this.notifModal.title().text(titleString);
        this.notifModal.deleteButtonText("Dismiss notifications");

        if (!auth.current.isAuthenticated) {
            this.notifModal.body().append(`
                    < div class= "notif-empty" >
                    <div class="notif-empty-body">
                        <i class="far fa-bell"></i>
                    </div>
                    <div class="notif-empty-message">
                        <span>Please log in to see notifications here.</span>
                    </div>
                    </div > `);
        }

        this.notifModal.deleteButton().click(async (evt) => {
            evt.preventDefault();
            await this.dismissNotificationsAsync();
        });


    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
    }


    onUnload() {
    }



}
