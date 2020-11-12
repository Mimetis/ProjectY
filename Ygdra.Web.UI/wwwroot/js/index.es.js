// @ts-check 

class router {

    constructor() {
        this.map = new Map();
        this.currentQueryParameters = new Map();

        window.addEventListener('popstate', (pse) => this._onLocationChange(pse));

        this._init(location.href);

        // called every time the document is ready
        // event after an history callback whith popstate
        $(() => this._run());


    }
  
    /**
     * @returns {string} get the current view name (the /{View} name page)
     */
    getCurrentView() {
        return this.currentView;
    }

    /**
     * @returns {{[]}} get the query parameters
     */
    getQueryParameters() {
        return this.currentQueryParameters;
    }


    /**
     * @returns {URL} get the current url
     */
    getCurrentUrl() {
        return this.currentUrl;
    }

    /**
     * @returns {object} get the current state (usely after a post, and declared from the node view in {state} object)
     */
    getCurrentState() {
        return this.currentState;
    }


    /**
     * init the router on each url requested
     * @param {string} loc current location href
     */
    _init(loc) {
        //this.currentUrl = new urijs(loc);
        this.currentUrl = new URL(loc);

        // get the current view
        this.currentView = this.currentUrl.pathname;

        // set the query parameters
        this.currentUrl.searchParams.forEach((value, key) => {
            this.currentQueryParameters.set(key, value);
        });

    }


    /**
    * @param {PopStateEvent} popStateEvent 
    */
    _onLocationChange(popStateEvent) {
        var srcElem = popStateEvent.srcElement;

        // @ts-ignore
        if (!srcElem || !srcElem.location)
            return;

        if (this.currentPage && this.currentPage.onUnload)
            this.currentPage.onUnload();

        // @ts-ignore
        this._init(srcElem.location.href);
        this._run();
    }


    _createInstance(constructor) {
        var factory = constructor.bind.apply(constructor, arguments);
        return new factory();
    };


    /**
     * 
     * @param {string} url 
     * @param {object} [state] 
     */
    navigateTo(url, state) {

        if (url === this.currentUrl.pathname)
            return;

        window.history.pushState(state ? state : {}, "", url);
    }

    /**
    * @param {string} pathName : pathname uri
    * @param {object} pageHandler
    */
    register(pathName, pageHandler) {
        this.map.set(pathName, pageHandler);
    }

    _run() {

        if (!$)
            return;

        this.currentState = $("#routerState").val();

        if (this.currentState)
            this.currentState = JSON.parse(this.currentState);

        let currentKey;

        this.map.forEach((v, k) => {
            var r = new RegExp(k, 'i');
            let isMatch = r.test(this.currentView);
            if (isMatch)
                currentKey = k;
        });

        if (!currentKey)
            return;

        let currentPageCtor = this.map.get(currentKey);

        if (!currentPageCtor)
            return;

        this.currentPage = this._createInstance(currentPageCtor);

        if (!this.currentPage)
            return;

        if (this.currentPage.onLoad) {
            $(() => {
                this.currentPage.onLoad(this);
                console.log("router has loaded page " + this.currentView);
            });
        }

        if (this.currentPage.onUnload) {
            $(window).on('beforeunload', () => {
                this.currentPage.onUnload();
            });
        }

    }

}

// singleton
var router$1 = new router();

// @ts-check


class dashboardPage {


    constructor() {
    }

    async onLoad() {

    }


    /**
     * @param {number} pageIndex get the current page index
     */
    async refresh(pageIndex) {
    }

    onUnload() {
    }



}

// @ts-check

class enginesPage {


    constructor() {

    }

    async onLoad() {

    }


    onUnload() {
    }
}

// @ts-check

class modalPanel {

    /**
     * @param {string} id
     */
    constructor(id) {
        this.id = id;
        this._shownPanel = (e) => { };
        this._showPanel = (e) => { };
        this._unloadPanel = (e) => { };
        this._large = "";
        this._position = "right";
        this._center = "";

        $(() => {
            let modalHtmlDiv = this.generateModalHtml();

            $('body').append(modalHtmlDiv);

            this.panel().on('shown.bs.modal', this._shownPanel);
            this.panel().on('show.bs.modal', this._showPanel);
            this.panel().on('hide.bs.modal', this._unloadPanel);

        });
    }

    /** @returns modalPanel */
    sm() {
        this._large = "";
        return this;
    }


    /** @returns modalPanel */
    lg() {
        this._large = " modal-lg";
        return this;
    }

    /** @returns modalPanel */
    xl() {
        this._large = " modal-xl";
        this._position = "";
        return this;
    }


    /** @returns modalPanel */
    readonly() {
        this._data_readonly = 'data-backdrop="static" data-keyboard="false" ';
        return this;
    }

    center() {
        this._center = "modal-dialog-centered modal-dialog-scrollable";
        return this;
    }
    /**
    *
    * @callback onModalEvent
    * @param {import("bootstrap").ModalEventHandler<HTMLElement>} event
    */



    /**
     * @param {onModalEvent} shownPanelEvent - Called when the panel is shown.
     */
    onShown(shownPanelEvent) { this._shownPanel = shownPanelEvent; }

    /**
     * @param {onModalEvent} showPanelEvent - Called when the panel is loading, before shown.
     */
    onShow(showPanelEvent) { this._showPanel = showPanelEvent; }

    /**
     * @param {onModalEvent} unloadPanelEvent - Called when the panel is unloading.
     */
    onUnLoad(unloadPanelEvent) { this._unloadPanel = unloadPanelEvent; }

    /** @returns {JQuery<HTMLElement>} */
    panel() { return $(`#${this.id}`) }

    /** @returns {JQuery<HTMLButtonElement>} */
    submitButton() { return $(`#${this.id}SubmitButton`) }

    /**  @returns {JQuery<HTMLButtonElement>} */
    deleteButton() {
        return $(`#${this.id}DeleteButton`)
    }

    deleteButtonText(text) {
        $(`#${this.id}DeleteButtonText`).text(text);
    }


    /** @returns {JQuery<HTMLButtonElement>}*/
    closeButton() { return $(`#${this.id}CloseButton`) }

    /** @returns {JQuery<HTMLDivElement>}*/
    // @ts-ignore
    body() { return $(`#${this.id}Body`) }

    /** @returns {JQuery<HTMLHRElement>}*/
    // @ts-ignore
    title() { return $(`#${this.id}Title`) }


    generateModalHtml() {

        let modal = `
        <div class="modal ${this._position} fade" id="${this.id}" tabindex="-1" ${this._data_readonly}aria-labelledby="${this.id}" aria-hidden="true">
            <div class="modal-dialog${this._large} ${this._center}">
                <div class="modal-content${this._large}">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${this.id}Title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="${this.id}Body">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark btn-sm" data-dismiss="modal" id="${this.id}CloseButton">
                            <i class="fas fa-undo"></i>
                            Close
                        </button>
                        <button type="button" class="btn btn-primary btn-sm" id="${this.id}SubmitButton">
                            <i class="fas fa-save"></i>
                            Submit
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" id="${this.id}DeleteButton">
                            <i class="fas fa-trash-alt"></i>
                            <span id="${this.id}DeleteButtonText">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        return modal;
    }

}

class console2 {

    /**
     * @param {JQuery<HTMLDivElement>} element
     * @param {JQuery<HTMLDivElement>} parentOverflowElement
     **/
    constructor(element, parentOverflowElement = null) {

        this._console2 = element;
        this._parentOverflowElement = parentOverflowElement;

        if (this._parentOverflowElement)
            this._initialTop = this._parentOverflowElement.position().top;

        // @ts-ignore
        window.Prism = window.Prism || {};
        // @ts-ignore
        window.Prism.manual = true;

        this._mgtlogin = document.getElementById('mgtlogin');

    }

    _userName() {

        let userName = "";

        if (this._mgtlogin && this._mgtlogin.userDetails) {

            let mail = this._mgtlogin.userDetails.email;
            if (!mail)
                mail = this._mgtlogin.userDetails.userPrincipalName;

            let nameMatch = mail.match(/^([^@]*)@/);
            userName = nameMatch ? nameMatch[1] : "";
        }

        return userName;
    }

    _scrollToEnd() {
        if (!this._parentOverflowElement)
            return;

        let height = this._console2.height();
        var newPos = this._initialTop + height;

        this._parentOverflowElement.scrollTo(newPos, 100);


    }

    clear() {
        this._console2.empty();
    }

    appendObject(jsonObject) {

        // @ts-ignore
        let jsonString = Prism.highlight(JSON.stringify(jsonObject, null, 2), Prism.languages.json, 'json');

        let str = "<pre class='ml-3 mr-3 mt-3' style='background-color:white;white-space:pre-wrap;width:90%;max-height:250px;'><code>";
        str += jsonString;
        str += "</code></pre>";

        this._console2.append(str);
        this._scrollToEnd();

    }



    appendWarning(line) {

        let str = `<div class="d-flex flex-row">`;
        str += `<span class="text-warning">${this._userName()}</span>`;
        str += `<span class="text-white">:</span>`;
        str += `<span class="text-warning">~$&nbsp;</span>`;
        str += `<span class="text-white">${line}</span>`;
        str += '</div>';

        this._console2.append(str);
        this._scrollToEnd();

    }

    appendError(line) {

        let str = `<div class="d-flex flex-row">`;
        str += `<span class="text-danger">${this._userName()}</span>`;
        str += `<span class="text-white">:</span>`;
        str += `<span class="text-danger">~$&nbsp;</span>`;
        str += `<span class="text-white">${line}</span>`;
        str += '</div>';

        this._console2.append(str);
        this._scrollToEnd();

    }

    log(line) { this.appendLine(line); }
    info(line) { this.appendLine(line); }
    error(line) { this.appendError(line); }
    warn(line) { this.appendWarning(line); }


    appendLine(line) {

        
        let str = `<div class="d-flex flex-row">`;
        str += `<span class="text-success">${this._userName()}</span>`;
        str += `<span class="text-white">:</span>`;
        str += `<span class="text-success">~$&nbsp;</span>`;
        str += `<span class="text-white">${line}</span>`;
        str += '</div>';

        this._console2.append(str);
        this._scrollToEnd();
    }


}

// @ts-check

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//export function enable() {
//    this.removeClass('disabled');
//    this.prop('disabled', false);
//}
//export function disable() {
//    this.addClass('disabled');
//    this.prop('disabled', true);

//}

///**
// * @param {string} data_url
// * @param {JQuery<HTMLElement>} element
// */
//export function loadPartialAsync(data_url, element) {
//    return new Promise((resolve, reject) => {
//        element.load(data_url, (response, status, xhr) => {
//            if (status == "error") {
//                reject(response);
//            }
//            resolve(response);
//        });
//    });
//}

// @ts-check

class handlers {

    constructor() {
        this.methods = {};
    }

    /**
     * 
     * @param {string} methodName
     * @param {Function} newMethod
     */
    on(methodName, newMethod) {
        if (!methodName || !newMethod) {
            return;
        }

        methodName = methodName.toLowerCase();

        // if there is no handlers already, create an empty array
        if (!this.methods[methodName]) {
            this.methods[methodName] = [];
        }

        // Preventing adding the same handler multiple times.
        if (this.methods[methodName].indexOf(newMethod) !== -1) {
            return;
        }

        // add the method to the handler list
        this.methods[methodName].push(newMethod);
    }


    /**
     * Unregister an handler
     * @param {string} methodName method name
     * @param {any} method (...args: any[]) => void
     */
    off(methodName, method) {
        if (!methodName) {
            return;
        }

        methodName = methodName.toLowerCase();

        // get all handlers with this method name
        const handlers = this.methods[methodName];

        // if handlers do not exists, return
        if (!handlers) {
            return;
        }

        // if we have a function existing
        if (method) {

            // get the index in all handlers
            const removeIdx = handlers.indexOf(method);

            // if we found it, make a splice in the handlers list
            if (removeIdx !== -1) {
                handlers.splice(removeIdx, 1);

                // if no more handlers, delete
                if (handlers.length === 0) {
                    delete this.methods[methodName];
                }
            }
        } else {
            delete this.methods[methodName];
        }

    }

    /**
     * @param {string} target   
     */
    invoke(target, ...parameters) {

        var _this = this;

        // get the methods array to invoke
        const methods = this.methods[target.toLowerCase()];

        // if we have at least on method in the methods array to invoke
        if (methods) {

            try {
                for (let m of methods) {
                    m.apply(_this, parameters);
                }
            } catch (e) {
                console.log(`A callback for the method ${target.toLowerCase()} threw error '${e}'.`);
            }

        } else {
            console.log(`No client method with the name '${target.toLowerCase()}' found.`);
        }
    }
}

/// <reference path="../wwwroot/lib/signalr/dist/browser/signalr.js" />

// @ts-check

class notification {

    // singleton
    static _current;

    /** @returns {notification} */
    static get current() {
        if (!notification._current)
            notification._current = new notification();

        return notification._current;
    }



    // events
    static OnStarted = "OnStarted";
    static OnStopped = "OnStopped";
    static OnConnected = "OnConnected";
    static OnConnecting = "OnConnecting";


    constructor() {
        this._handlers = new handlers();
        this._isConnected = false;
        this._isStarting = false;

        this.connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.None)
            .withUrl('/notifications')
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Trace)
            .build();

        this.connection.onreconnecting(error => this._console.log(error));
        this.connection.onclose(error => this.onConnectionError(error));

        this.connection.on("connected", (_) => {
            this._isConnected = true;
            this._handlers.invoke(notification.OnConnected);
        });

    }

    async start() {
        let retryCount = 0;

        if (this._isStarting)
            return;

        this._isStarting = true;

        while (!this._isConnected && retryCount < 5) {

            retryCount++;

            if (this._isConnected) {
                break;
            }

            if (this.connection.state == signalR.HubConnectionState.Disconnected) {
                this._handlers.invoke(notification.OnConnecting);
                await this.connection.start();
            }

            await delay(1500);

            if (this._isConnected) {
                break;
            }
        }

        if (!this._isConnected || retryCount >= 5) {
            this._isStarting = false;
            throw new Error("Too many tries to connect");
        }

        this._handlers.invoke(notification.OnStarted);

    }

    async stop() {

        if (this.connection.state != signalR.HubConnectionState.Disconnected) {
            await this.connection.stop();
            this._handlers.invoke(notification.OnStopped);
        }

        this._isConnected = false;
        this._isStarting = false;

    }

    /**
     * @param {string} method
     * @param {Function} handler
     */
    on(method, handler) {
        if (method == notification.OnConnected ||
            method == notification.OnConnecting ||
            method == notification.OnStarted ||
            method == notification.OnStopped) {

            this._handlers.on(method, handler);

        } else {

            this.connection.on(method, handler);
        }

    }

    /**
     * @param {string} method
     * @param {Function} handler
     */
    off(method, handler) {
        if (method == notification.OnConnected ||
            method == notification.OnConnecting ||
            method == notification.OnStarted ||
            method == notification.OnStopped) {

            this._handlers.off(method, handler);

        } else {

            this.connection.off(method, handler);
        }

    }
    onConnectionError(error) {
        if (error && error.message) {
            this._console.error(error.message);
        }
    }


}

// @ts-check


class modalPanelDeleteEngine {



    static initialize(modal_data_target) {
        return new modalPanelDeleteEngine(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalEngine.deleteButton().click(async (event) => { await this.deleteEngineAsync(event); });
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.deleteConsoleElement = this.modalEngine.body().find('.console');
        this.deleteConsole = new console2(this.deleteConsoleElement, this.modalEngine.body());

        // subscribe to event from signalr about deployment
        notification.current.on("deploy", this.appendDeployToConsole.bind(this));

        notification.current.on(notification.OnStarted, async () => await this.deleteConsole.appendLine("Backend server started."));
        notification.current.on(notification.OnConnecting, async () => await this.deleteConsole.appendLine("Backend server connecting..."));
        notification.current.on(notification.OnConnected, async () => await this.deleteConsole.appendLine("Backend server connected..."));
        notification.current.on(notification.OnStopped, async () => await this.deleteConsole.appendLine("Backend server stopped."));


    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineRequestResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineRequestResponse.status >= 400) {
            $(location).attr('href', '/Admin/Index');
            return;
        }

        let engineRequest = await engineRequestResponse.json();

        // timeout of the page for some reason ?
        if (!engineRequest) {
            $(location).attr('href', '/');
            return;
        }

        this.modalEngine.deleteButton().show();

        $("<div class='m-2'>Are you sure you want to delete engine <b>" + engineRequest.engineName + "</b> ?</div>").insertBefore(this.deleteConsoleElement);

        this.deleteConsole.appendLine("Ready to delete. Please press 'Delete' button to start.");
    }

    /** @param {JQuery.ClickEvent<HTMLButtonElement, null, HTMLButtonElement, HTMLButtonElement>} evt */
    async deleteEngineAsync(evt) {

        evt.preventDefault();

        if (!this.engineId) {
            this.deleteConsole.appendError("Unable to retrieve the engine request id....");
            return;
        }

        // Get notification helper
        await notification.current.start();

        // subscribe to this deployment (for this user)
        await notification.current.connection.invoke('SubscribeDeploymentAsync', this.engineId);

        this.deleteConsole.appendLine("Waiting for an agent to enqueue the engine drop operation...");

        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        let urlDeletion = `/api/engines/${this.engineId}`;

        let response = await fetch(urlDeletion, { method: 'DELETE' });

        if (this._isInterrupted)
            return;

        if (response.status >= 400) {
            this.deleteConsole.appendError(`Unable to delete the engine request with Id ${this.engineId} `);
            return;
        }

        let dropEngineStart = await response.json();

        await this.appendDeployToConsole(dropEngineStart);

    }


    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.deleteConsole.appendError(deploy.message);
                break;
            case "Droping":
                this.deleteConsole.appendLine(deploy.message);
                break;
            case "Dropped":
                this.deleteConsole.appendLine(deploy.message);
                break;
            default:
                this.deleteConsole.appendWarning(deploy.message);
        }

        if (value)
            this.deleteConsole.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check

class modalPanelResourceGroup {



    static initialize(modal_data_target) {
        return new modalPanelResourceGroup(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        // remove unecessary buttons
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.consoleElement = this.modalEngine.body().find('.console');
        this.console = new console2(this.consoleElement, this.modalEngine.body());

    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.console.appendLine(`Getting information...`);

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineResponse.status >= 400) {
            this.console.appendError("Can't get engine details");
            return;
        }

        let engine = await engineResponse.json();

        // timeout of the page for some reason ?
        if (!engine) {
            this.console.appendError("Can't get engine details");
            return;
        }

        this.console.appendLine(`Resource group <strong>${engine.resourceGroupName}</strong> ...`);

        let rgResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (rgResponse.status >= 400) {
            this.console.appendError("Can't get resource group details");
            return;
        }

        let resourceGroup = await rgResponse.json();

        this.console.appendObject(resourceGroup);

        let rgLinkResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}/link`, {
            method: 'POST',
            body: JSON.stringify({ id: resourceGroup.id }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (rgLinkResponse.status >= 400) {
            this.console.appendError("Can't get resource group link.");
            return;
        }
        let resourceGroupLink = await rgLinkResponse.json();

        this.console.appendLine(`Azure resource group link : <a href=${resourceGroupLink.uri} target="_blank">${resourceGroup.name}</a>`);

        this.console.appendLine(`Done.`);


    }



    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console.appendError(deploy.message);
                break;
            case "Droping":
                this.console.appendLine(deploy.message);
                break;
            case "Dropped":
                this.console.appendLine(deploy.message);
                break;
            default:
                this.console.appendWarning(deploy.message);
        }

        if (value)
            this.console.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check

class modalPanelDatabricks {



    static initialize(modal_data_target) {
        return new modalPanelDatabricks(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        // remove unecessary buttons
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.consoleElement = this.modalEngine.body().find('.console');
        this.console = new console2(this.consoleElement, this.modalEngine.body());

    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.console.appendLine(`Getting information...`);

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineResponse.status >= 400) {
            this.console.appendError("Can't get engine details");
            return;
        }

        let engine = await engineResponse.json();

        // timeout of the page for some reason ?
        if (!engine) {
            this.console.appendError("Can't get engine details");
            return;
        }

        this.console.appendLine(`Resource group: <strong>${engine.resourceGroupName}</strong>.`);
        this.console.appendLine(`Databricks workspace: <strong>${engine.clusterName}</strong>.`);
        this.console.appendLine(`Getting information from Azure...`);

        let resourceResponse = await fetch(`/api/databricks/${engine.id}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceResponse.status >= 400) {
            this.console.appendError("Can't get databricks details");
            return;
        }

        let resource = await resourceResponse.json();

        this.console.appendObject(resource);

        let resourceLinkResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}/link`, {
            method: 'POST',
            body: JSON.stringify({ id: resource.id }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceLinkResponse.status >= 400) {
            this.console.appendError("Can't get resource link.");
            return;
        }
        let resourceLink = await resourceLinkResponse.json();

        this.console.appendLine(`Azure Databriks workspace link: <a href="${resourceLink.uri}" target="_blank">${resource.name}</a>`);

        this.console.appendLine(`Databricks workspace link: <a href="https://${resource.properties.workspaceUrl}" target="_blank">${resource.name}</a>`);

        this.console.appendLine(`Getting information from Databricks...`);

        resourceResponse = await fetch(`/api/databricks/${engine.id}/cluster`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceResponse.status >= 400) {
            this.console.appendError("Can't get databricks details");
            return;
        }

        resource = await resourceResponse.json();

        this.console.appendObject(resource);


        this.console.appendLine(`Done.`);


    }



    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console.appendError(deploy.message);
                break;
            case "Droping":
                this.console.appendLine(deploy.message);
                break;
            case "Dropped":
                this.console.appendLine(deploy.message);
                break;
            default:
                this.console.appendWarning(deploy.message);
        }

        if (value)
            this.console.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check

class modalPanelDataFactory {



    static initialize(modal_data_target) {
        return new modalPanelDataFactory(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        // remove unecessary buttons
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.consoleElement = this.modalEngine.body().find('.console');
        this.console = new console2(this.consoleElement, this.modalEngine.body());

    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.console.appendLine(`Getting information...`);

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineResponse.status >= 400) {
            this.console.appendError("Can't get engine details");
            return;
        }

        let engine = await engineResponse.json();

        // timeout of the page for some reason ?
        if (!engine) {
            this.console.appendError("Can't get engine details");
            return;
        }

        this.console.appendLine(`Resource group <strong>${engine.resourceGroupName}</strong> ...`);
        this.console.appendLine(`Data factory V2: <strong>${engine.factoryName}</strong>.`);
        this.console.appendLine(`Getting information from Azure...`);

        let resourceResponse = await fetch(`/api/datafactories/${engine.id}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceResponse.status >= 400) {
            this.console.appendError("Can't get data factory details");
            return;
        }

        let resource = await resourceResponse.json();

        this.console.appendObject(resource);

        let resourceLinkResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}/link`, {
            method: 'POST',
            body: JSON.stringify({ id: resource.id }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceLinkResponse.status >= 400) {
            this.console.appendError("Can't get resource group link.");
            return;
        }
        let resourceLink = await resourceLinkResponse.json();

        this.console.appendLine(`Azure resource group link : <a href=${resourceLink.uri} target="_blank">${resource.name}</a>`);

        this.console.appendLine(`Done.`);


    }



    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console.appendError(deploy.message);
                break;
            case "Droping":
                this.console.appendLine(deploy.message);
                break;
            case "Dropped":
                this.console.appendLine(deploy.message);
                break;
            default:
                this.console.appendWarning(deploy.message);
        }

        if (value)
            this.console.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check


class modalPanelPreview {


    static initialize(modal_data_target) {
        return new modalPanelPreview(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalPreview = new modalPanel(modal_data_target).xl().center();

        this.modalPreview.onShown(e => this.shownPanel(e));
        this.modalPreview.onUnLoad(e => this.unloadPanel(e));
        this.modalPreview.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalPreview;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalPreview.submitButton().hide();
        this.modalPreview.deleteButton().hide();

        let titleString = button.data('title');

        this.modalPreview.body().empty();
        this.modalPreview.title().text(titleString);
        this.modalPreview.body().text('Loading ...');
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        var button = $(event.relatedTarget); // Button that triggered the modal

        // Extract info from data-* attributes
        var engineId = button.data('engine-id');
        var dataSourceName = button.data('data-source-name');
        var schemaName = button.data('schema-name');
        var tableName = button.data('table-name');


        let previewRowsResponse = await fetch(`/api/AzureSqlDatabase/${engineId}/${dataSourceName}/tables/${schemaName}/${tableName}/preview`);

        if (previewRowsResponse.status != 400) {
            let previewRows = await previewRowsResponse.json();

            if (previewRows.length) {

                this.modalPreview.body().empty();
                this.modalPreview.body().append("<table id='table'></table>");

                var row1 = previewRows[0];

                var columns = [];
                for (var o in row1) {
                    columns.push({
                        field: o,
                        title: o
                    });
                }

                $('#table').bootstrapTable({
                    columns: columns,
                    data: previewRows
                });


            } else {
                this.modalPreview.body().text('No rows...');
            }
        }
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalPreview.body().empty();
    }


}

// @ts-check


class modalPanelUsers {


    static initialize(modal_data_target) {
        return new modalPanelUsers(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalUsers = new modalPanel(modal_data_target).sm();

        this.modalUsers.onShown(e => this.shownPanel(e));
        this.modalUsers.onUnLoad(e => this.unloadPanel(e));
        this.modalUsers.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalUsers;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalUsers.submitButton().hide();
        this.modalUsers.deleteButton().hide();

        let titleString = button.data('title');

        this.modalUsers.body().empty();
        this.modalUsers.title().text(titleString);
        this.modalUsers.body().text('Loading ...');
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        var button = $(event.relatedTarget); // Button that triggered the modal
        var usersIdsVal = button.data('users-id'); // Extract info from data-* attributes

        if (!usersIdsVal || usersIdsVal === '') {
            this.modalUsers.body().text('Nothing to show.');
            return;
        }

        let usersIds = usersIdsVal.split(',').map(v => v.trim());

        for (var i = 0; i < usersIds.length; i++) {
            if (i === 0)
                this.modalUsers.body().empty();

            let userId = usersIds[i];

            if (!userId || userId == '')
                continue;

            this.modalUsers.body().append(
                "<div class='m-3' style='overflow:auto;'><mgt-person user-id='" + usersIds[i] + "' fetch-image='true' person-card='hover' view='twoLines'></mgt-person></div>"
            );

            if (this._isInterrupted)
                return;
        }
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalUsers.body().empty();
    }


}

// @ts-check

class engineDetailsPage {


    constructor() {

    }

    async onLoad() {
        modalPanelUsers.initialize("panelDeploymentOwners");
        modalPanelUsers.initialize("panelDeploymentMembers");
        modalPanelUsers.initialize("panelRequestOwners");
        modalPanelUsers.initialize("panelRequestMembers");

        modalPanelDeleteEngine.initialize("panelDeleteEngine");
        modalPanelResourceGroup.initialize("panelResourceGroup");
        modalPanelDatabricks.initialize("panelDatabricks");
        modalPanelDataFactory.initialize("panelDataFactory");

        this.id = $("#Id");

        if ($("#console").length) {
            this.console2 = new console2($("#console"), $('div.docking-form'));

            notification.current.on(notification.OnStarted, async () => {
                await notification.current.connection.invoke('SubscribeDeploymentAsync', this.id.val());
            });

            notification.current.on("deploy", this.appendDeployToConsole.bind(this));
        }


    }

    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console2.appendError(deploy.message);
                break;
            case "Deployed":
                this.console2.appendLine(deploy.message);
                break;
            case "Deploying":
                this.console2.appendLine(deploy.message);
                break;
            default:
                this.console2.appendWarning(deploy.message);
        }

        if (value)
            this.console2.appendObject(value);
    }


    onUnload() {
        notification.current.off("deploy", this.appendDeployToConsole.bind(this));

    }



}

class dotmimtable {

    static initialize() {

    }

    constructor(name, url, urlCount, pageSize) {

        this.name = name;
        this.url = url;
        this.urlCount = urlCount ?? this.url + "/count";

        this.spinner = $('#spinner-' + name);
        this.body = $('#tbody-' + name);
        this.previous = $('#previous-' + name);
        this.next = $('#next-' + name);
        this.refresh = $('#refresh-' + name);

        // disable buttons
        this.previous.parent().addClass('disabled');
        this.next.parent().addClass('disabled');

        // get a page
        this.pageIndex = 0;
        this.itemsCount = 0;
        this.pageSize = pageSize ?? 2;

        this.refresh.click((evt) => {
            evt.preventDefault();
            this.run();
        });

        this.previous.click((evt) => {
            evt.preventDefault();
            this.pageIndex = this.pageIndex - 1;
            this.load();
        });

        this.next.click((evt) => {
            evt.preventDefault();
            this.pageIndex = this.pageIndex + 1;
            this.load();
        });
    }

    async load() {
        let url = this.url + '?pageIndex=' + this.pageIndex + '&count=' + this.pageSize;

        this.spinner.show();
        //let d = await $.getJSON(url);

        this.body.load(url, (d, status, xhr) => {

            if (status == "error") {
                console.log(status);
            }

            if (!d || d.trim() == '')
                this.clearRows('No data');

            this.spinner.hide();
            this.enableDisableButtons();
        });

    }

    run() {
        this.spinner.show();
        this.clearRows();

        $.getJSON(this.urlCount, data => {
            this.itemsCount = data.count;
            this.load();
        }).fail((error) => {

            let errorString = error.responseJSON ? (error.responseJSON.error ?? error.responseJSON) : error.responseText;

            this.addFirstRowWarning(errorString);
            this.spinner.hide();
            this.enableDisableButtons();
        });
    }

    addFirstRowWarning(text) {
        this.body.children('tr').addClass('bg-danger');
        this.body.children('tr').children('td').addClass('text-light').append(text);
    }

    clearRows(text) {
        let columnsCount = this.body.parent().find('th').length;
        if (!columnsCount)
            columnsCount = this.body.parent().find('tr').length;
        if (!columnsCount)
            columnsCount = 1;

        text = text ?? '&nbsp;';

        this.body.html('<tr><td colspan=' + columnsCount + '>' + text + '</td></tr>');
    }


    enableDisableButtons() {

        if (this.pageIndex <= 0)
            this.previous.parent().addClass('disabled');
        else
            this.previous.parent().removeClass('disabled');

        if ((this.pageIndex + 1) * this.pageSize >= this.itemsCount)
            this.next.parent().addClass('disabled');
        else
            this.next.parent().removeClass('disabled');

    }
}

// @ts-check

class adminPage {


    constructor() {

    }

    async onLoad() {
    }

    onUnload() {
    }

}

// @ts-check

class adminDeploymentEnginePage {


    constructor() {

        modalPanelUsers.initialize("panelDeploymentOwners");
        modalPanelUsers.initialize("panelDeploymentMembers");
        modalPanelUsers.initialize("panelRequestOwners");
        modalPanelUsers.initialize("panelRequestMembers");
    }

    async onLoad() {


        this.id = $("#EngineView_Id");
        this.console2 = new console2($("#console"), $('div.docking-form'));
        this.launchButton = $('#launch');
        this.launchButton.prop('disabled', true);

        if (!this.id || !this.id.val()) {
            this.console2.appendWarning("Can't launch deployment. No engine request ...");
            return;
        }

        // subscribe to event from signalr about deployment
        notification.current.on("deploy", this.appendDeployToConsole.bind(this));

        notification.current.on(notification.OnStarted, async () => {
            await notification.current.connection.invoke('SubscribeDeploymentAsync', this.id.val());
            this.console2.appendLine("Backend server started.");
            this.console2.appendLine("Ready to deploy.");
            this.console2.appendLine("-----------------------");
            this.launchButton.prop('disabled', false);
        });

        notification.current.on(notification.OnConnecting, async () => await this.console2.appendLine("Backend server connecting..."));
        notification.current.on(notification.OnConnected, async () => await this.console2.appendLine("Backend server connected..."));
        notification.current.on(notification.OnStopped, async () => await this.console2.appendLine("Backend server stopped."));

        // Just in case it's not started (but should be done already from homePage.js)
        await notification.current.start();

        this.launchButton.click(async (evt) => {
            evt.preventDefault();

            // Launch a validation before
            let isValid = $("form").valid();

            if (!isValid)
                return;

            await this.launchJobAsync();
        });

    }



    async launchJobAsync() {
        this.console2.clear();

        this.console2.appendLine("Deployment started.");
        this.console2.appendLine("-----------------------");

        if (!this.id || !this.id.val()) {
            this.console2.appendWarning("Can't launch deployment. No engine request ...");
            return;
        }

        this.console2.appendLine("Saving deployment properties...");

        try {
            // First, save the deployment.
            await $.post('', $('form').serialize());

        } catch (e) {
            this.console2.appendError(`Unable to save engine details`);
            this.console2.appendObject(e.responseJSON);
            return;
        }

        try {
            this.console2.appendLine("Waiting for an agent to enqueue the deployment...");

            // url for that particular deployment
            let url = `/api/engines/${this.id.val()}/deploy`;

            var response = await fetch(url, { method: 'POST' });

            if (response.status >= 400) {
                this.console2.appendError(`<b>Deployment</b> ${this.id.val()} can not be deployed...`);
                var errorJson = await response.json();
                await this.console2.appendObject(errorJson);
                return;
            }

            let deploymentstart = await response.json();

            await this.appendDeployToConsole(deploymentstart);

        } catch (e) {
            this.console2.appendError(`Unable to deploy engine`);
            this.console2.appendObject(e.responseJSON);
        }
    }

    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console2.appendError(deploy.message);
                break;
            case "Deployed":
                this.console2.appendLine(deploy.message);
                break;
            case "Deploying":
                this.console2.appendLine(deploy.message);
                break;
            default:
                this.console2.appendWarning(deploy.message);
        }

        if (value)
            this.console2.appendObject(value);
    }

    async onUnload() {
        notification.current.off("deploy", this.appendDeployToConsole.bind(this));
    }


}

// @ts-check

class adminEngineRequestDetailsPage {


    constructor() {

    }

    async onLoad() {
        modalPanelUsers.initialize("panelDeploymentOwners");
        modalPanelUsers.initialize("panelDeploymentMembers");
        modalPanelUsers.initialize("panelRequestOwners");
        modalPanelUsers.initialize("panelRequestMembers");

        modalPanelDeleteEngine.initialize("panelDeleteEngine");
        modalPanelResourceGroup.initialize("panelResourceGroup");
        modalPanelDatabricks.initialize("panelDatabricks");
        modalPanelDataFactory.initialize("panelDataFactory");

        this.id = $("#Id");

        if ($("#console").length) {
            this.console2 = new console2($("#console"), $('div.docking-form'));

            notification.current.on(notification.OnStarted, async () => {
                await notification.current.connection.invoke('SubscribeDeploymentAsync', this.id.val());
            });

            notification.current.on("deploy", this.appendDeployToConsole.bind(this));
        }
    }

    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console2.appendError(deploy.message);
                break;
            case "Deployed":
                this.console2.appendLine(deploy.message);
                break;
            case "Deploying":
                this.console2.appendLine(deploy.message);
                break;
            default:
                this.console2.appendWarning(deploy.message);
        }

        if (value)
            this.console2.appendObject(value);
    }


    onUnload() {
        notification.current.off("deploy", this.appendDeployToConsole.bind(this));

    }

}

class mgtloader {


    static setMgtProvider() {
        const provider = new mgt.ProxyProvider("/api/Proxy");
        provider.login = () => window.location.href = '/Account/SignIn?redirectUri=' + window.location.href;
        provider.logout = () => window.location.href = '/MicrosoftIdentity/Account/SignOut';

        mgt.Providers.globalProvider = provider;
    }

    static interceptMgtLogin() {
        var mgtlogin = document.getElementById('mgtlogin');

        //// Theses events are raised when user click on login our logout button
        //// Theyr are not raised at the good timing
        //// Should be renamed 'loginClick' and 'logoutClick'
        //mgtlogin.addEventListener('loginCompleted', () => localStorage.removeItem("userdetails"));
        //mgtlogin.addEventListener('logoutCompleted', () => localStorage.removeItem("userdetails"));

        //// get local storage item if any
        //var userDetailsFromStorageString = localStorage.getItem('userdetails');

        //if (userDetailsFromStorageString !== null && mgtlogin.userDetails === null)
        //    mgtlogin.userDetails = JSON.parse(userDetailsFromStorageString);

        //// Loading completed is correctly fired AFTER component is loaded AND user logged in
        //mgtlogin.addEventListener('loadingCompleted', () => {
        //    if (mgtlogin.userDetails !== null)
        //        localStorage.setItem('userdetails', JSON.stringify(mgtlogin.userDetails));
        //});

    }
}

// @ts-check

class auth {


	// singleton
	static _current;

	/** @returns {auth} */
	static get current() {
		if (!auth._current)
			auth._current = new auth();

		return auth._current;
	}

	static OnAuthenticated = "OnAuthenticated"

	constructor() {
		this.handlers = new handlers();

		/** @type boolean */
		this.isAuthenticated = globalUserAuthenticated;
	}

	initialize() {

		$(() => {
			// invoke all handlers to OnAuthenticated with the correct value
			this.handlers.invoke(auth.OnAuthenticated, this.isAuthenticated, 'cool');
		});
	}

	on(methodName, newMethod) {
		this.handlers.on(methodName, newMethod);
	}

	off(methodName, method) {
		this.handlers.off(methodName, method);
	}

}

// @ts-check

class homePage {

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

        // Get the notification modal
        this.notifModal = new modalPanel("notif").sm();

        // auto bind with arrow function
        this.notifModal.onShown(e => this.shownPanel(e));
        this.notifModal.onUnLoad(e => this.unloadPanel(e));
        // manual binding for fun
        this.notifModal.onShow(this.showPanel.bind(this));

        this.settingsModal = new modalPanel("settings").lg();

        this.settingsModal.onShown(e => this.shownSettingsPanel(e));
        this.settingsModal.onUnLoad(e => this.unloadSettingsPanel(e));


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
        var button = $(event.relatedTarget); // Button that triggered the modal
        var type = button.data('type');

    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    shownSettingsPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

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

        let button = $(event.relatedTarget); // Button that triggered the modal

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

// @ts-check

class settingsPage {


    constructor() {

    }

    async onLoad() {
    }


    onUnload() {
    }



}

function setEngineBootstrapTable($enginesTable, url, checked, onPostBody, onCheckRow) {


    let onCheck = checked ? onCheckRow : () => { };
    let onClick = checked ? () => { }: onCheckRow;

    let columns = [];
    if (checked)
        columns.push({
            field: 'engineId',
            radio: true,
        });

    columns.push({
        field: 'engineTypeJson',
        title: 'Type',
        width: '80',
        align: 'center',
        searchFormatter: false,
        sortable: true,
        formatter: (value, row) => {
            return `<div class='svg-22x22-icon'><div class='svg-icon ${value.engineTypeIconString}'></div></div>`;
        }
    }, {
        field: 'statusJson',
        title: 'Status',
        width: '80',
        align: 'center',
        searchFormatter: false,
        sortable: true,
        formatter: (value, row) => {
            return `<i class="${value.statusIcon}" title='${value.statusString}' style="color:${value.statusColor};width:20px;"></i>`;
        }

    }, {
        field: 'engineName',
        title: 'Name',
        sortable: true,
        formatter: (value, row) => {
            return `<strong>${value}</strong>`;
        }
    });

    $enginesTable.bootstrapTable({
        url: url,
        search: false,
        showRefresh: false,
        showToggle: false,
        checkboxHeader: false,
        clickToSelect: true,
        pagination: false,
        resizable: true,
        loadingTemplate: () => {
            return '<i class="fa fa-spinner fa-spin fa-fw fa-2x"></i>';
        },
        columns: columns,
        onPostBody: onPostBody,
        onCheck: onCheck,
        onClickRow: onClick,
        formatNoMatches: () => { return "You don't have any running engine. Please <a href='/Engines/Index'>check your engines status.</a> "; }
    });

}

// @ts-check

class dataSourcesPage {

    constructor() {

    }

    async onLoad() {

        // get table
        this.enginesTable = $("#enginesTable");

        // get engine table
        this.$enginesTable = $("#enginesTable");

        setEngineBootstrapTable(this.$enginesTable, "/dataSources/index/engines", true,
            (data) => this.onPostBody(data),
            (row) => this.onClickRow(row));

        this.dataSourcesTable = $("#dataSourcesTable");
        this.dataSourcesTable.bootstrapTable({
            formatNoMatches: () => { return 'Please select a running engine to see all data sources available.'; }
        });

        this.dataSourcesTable.on('click-row.bs.table', (row, $element, field) => {
            window.location.href = `/DataSources/Edit/${this.engine.id}/${$element.name}`;
        });
    }

    async onPostBody(data) {
        if (data && data.length > 0) {

            this.engine = data[0];
            this.$enginesTable.bootstrapTable('check', 0);
        }
    }

    async onClickRow(row) {

        this.engine = row;
        await this.loadDataSourcesAsync(this.engine);
    }


    async loadDataSourcesAsync(engine) {

        this.dataSourcesTable.bootstrapTable('showLoading');
        let data_url = `/dataSources/index/dataSources?engineId=${engine.id}`;
        let dataSourcesResponse = await fetch(data_url);
        this.dataSources = await dataSourcesResponse.json();

        if (!this.dataSources)
            this.dataSources = [];

        this.dataSourcesTable.bootstrapTable('updateFormatText', 'formatNoMatches',
            `No data sources for engine <strong>${engine.engineName}</strong>. <a href='/dataSources/new'>Create a new data source</a> for your engine`);

        this.dataSourcesTable.bootstrapTable('load', this.dataSources);

        this.dataSourcesTable.bootstrapTable('hideLoading');

    }

    async onUnLoad() {

    }
}

// @ts-check

class wizardPage {

    constructor(htmlFieldPrefix, engineUrl) {

        // HtmlFieldPrefix prefix is the predix for rendering asp.net core items
        this.htmlFieldPrefix = `${htmlFieldPrefix}_`;

        // url for loading engines
        this.engineUrl = engineUrl;
    }

    async onLoad() {
        // get form
        this.$form = $("form");

        // get engine table
        this.$enginesTable = $("#enginesTable");

        // get spinner
        this.$spinner = $("#spinner");

        // get buttons
        this.$nextButton = $("#nextButton");
        this.$previousButton = $("#previousButton");
        this.$saveButton = $("#saveButton");

        // get wizard
        this.$smartWizard = $("#smartWizard");

        // get properties panel
        this.$properties = $("#properties");

        // hidden fields
        this.$engineIdElement = $(`#${this.htmlFieldPrefix}EngineId`);
        this.$isNew = $(`#${this.htmlFieldPrefix}IsNew`);
        this.$step = $(`#${this.htmlFieldPrefix}Step`);

        this.step = this.$step ? this.$step.val() : 0;

        if (this.$spinner)
            this.$spinner.hide();

        this.boostrapEnginesTable();

        this.bootstrapWizard();

        this.bootstrapButtons();
    }


    bootstrapWizard() {

        // Step show event
        this.$smartWizard.on("showStep", async (e, anchorObject, stepNumber, stepDirection, stepPosition) => {

            this.$step.val(stepNumber);
            this.$nextButton.enable();
            this.$previousButton.enable();
            this.$nextButton.enable();
            this.$saveButton.disable();

            if (stepPosition === "first") {
                this.$previousButton.disable();
            } else if (stepPosition === "middle") {
                this.$previousButton.enable();
                this.$nextButton.enable();
            } else if (stepPosition === "last") {
                this.$nextButton.disable();
                this.$saveButton.enable();
            }

        });


        // bootstrap wizard
        this.$smartWizard.smartWizard({
            selected: this.step,
            theme: 'dots', // theme for the wizard, related css need to include for other than default theme
            autoAdjustHeight: false,
            transition: {
                animation: 'fade', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                speed: '200', // Transion animation speed
                easing: '' // Transition animation easing. Not supported without a jQuery easing plugin
            },
            enableURLhash: false,
            toolbarSettings: {
                toolbarPosition: 'none', // none, top, bottom, both
                toolbarButtonPosition: 'right', // left, right, center
                showNextButton: false, // show/hide a Next button
                showPreviousButton: false, // show/hide a Previous button
                toolbarExtraButtons: [] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
            },
            keyboardSettings: {
                keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            },
        });

    }


    async engineTableOnCheckRow(row, $element) {
        if (this.$engineIdElement)
            this.$engineIdElement.val(row.id);

    }
    async engineTableOnPostBody(data) {

        if (!data?.length) {
            this.$nextButton.disable();
            return;
        }

        if (this.$engineIdElement && this.$engineIdElement.val()) {

            let selectedIndex = data.findIndex(e => e.id === this.$engineIdElement.val());

            if (selectedIndex >= 0)
                this.$enginesTable.bootstrapTable('check', selectedIndex);
        }

        // get the radio inputs buttons to add a validation rule on them
        let $btSelectItem = $('input[name="btSelectItem"]');

        $btSelectItem.rules("add", {
            required: true,
            messages: {
                required: "You should select an engine before going next step.",
            }
        });

    }

    boostrapEnginesTable() {

        if (!this.$enginesTable || !this.engineUrl)
            return;

        setEngineBootstrapTable(this.$enginesTable, this.engineUrl, true,
            (data) => this.engineTableOnPostBody(data),
            (row, $element) => this.engineTableOnCheckRow(row, $element));

    }

    bootstrapButtons() {

        if (this.$previousButton) {
            this.$previousButton.click((evt) => {
                evt.preventDefault();
                this.$smartWizard.smartWizard("prev");
                return true;
            });
        }

        if (this.$nextButton) {
            this.$nextButton.click((evt) => {
                evt.preventDefault();

                if (!this.validateForm())
                    return false;

                this.$smartWizard.smartWizard("next");
                return true;
            });
        }
    }


    validateForm() {

        if (!this.$form)
            return true;

        let isValid = this.$form.valid();

        if (!isValid)
            return false;

        let validator = this.$form.validate();
        validator.resetForm();

        let summary = this.$form.find(".validation-summary-errors");

        if (summary) {
            let list = summary.find("ul");
            if (list)
                list.empty();
        }

        return true;
    }

}

// @ts-check
class dataSourceAzureSql {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;


        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureSqlDatabase`);
        }
 
        this.isLoaded = true;

    }

}

class dataSourceAzureDataLakeV2 {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);
        }


        this.isLoaded = true;

    }

}

class dataSourceAzureCosmosDb {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=CosmosDb`);
        }

        this.isLoaded = true;

    }
}

// @ts-check

class dataSourceNew extends wizardPage {

    constructor() {
        super('DataSourceView', '/dataSources/new/engines');

        this.dataSourceAzureSql = new dataSourceAzureSql();
        this.dataSourceAzureDataLakeV2 = new dataSourceAzureDataLakeV2();
        this.dataSourceAzureCosmosDb = new dataSourceAzureCosmosDb();
        this.lastTypeSelected = '';

    }

    async onLoad() {
        // call base onLoad method
        super.onLoad();


        this.$smartWizard.on("stepContent", async (e, anchorObject, stepNumber, stepDirection) => {
            if (stepNumber == 2) {

                this.$spinner?.show();

                try {

                    if (this.$engineIdElement) {
                        let engineId = this.$engineIdElement.val().toString();

                        if (!engineId?.length) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }
                        // get selection from data sources type
                        let type = $(`input[name="DataSourceView.DataSourceType"]:checked`).val();

                        if (!type) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }

                        if (this.lastTypeSelected === type.toString())
                            return;

                        this.lastTypeSelected = type.toString();

                        if (type.toString().toLowerCase() == 'azuresqldatabase')
                            await this.dataSourceAzureSql.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'azuresqldw')
                            await this.dataSourceAzureSql.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'azureblobfs')
                            await this.dataSourceAzureDataLakeV2.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'cosmosdb')
                            await this.dataSourceAzureCosmosDb.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                    }

                } catch (e) {

                    this.$smartWizard.smartWizard("goToStep", 0);
                }

                this.$spinner?.hide();

            }
        });


        // Getting test button
        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {

                evt.preventDefault();

                let engineId = $("#DataSourceView_EngineId").val();

                if (engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${engineId}/test`);
            });
        }

    }






    //async testConnectionAsync(evt) {

    //    evt.preventDefault();

    //    this.lblTestConnection.text("");
    //    this.lblTestConnection.removeClass();

    //    this.btnTestConnection.disable();

    //    // url for that particular deployment
    //    let url = `/api/dataSources/sqlconnection/test`;

    //    let response = await fetch(url, {
    //        method: 'POST',
    //        body: JSON.stringify({ connection: this.connectionString.val() }),
    //        headers: {
    //            "Content-type": "application/json; charset=UTF-8"
    //        }
    //    });

    //    if (response.status >= 400) {
    //        var errorJson = await response.json()
    //        await this.lblTestConnection.text(errorJson.error)
    //    }

    //    var result = await response.json();

    //    if (result.result) {
    //        this.lblTestConnection.addClass("text-success ml-2");
    //        this.lblTestConnection.html("<i class='fas fa-check-circle'></i>  Connection successful");
    //    }
    //    else {
    //        this.lblTestConnection.addClass("text-danger ml-2");
    //        this.lblTestConnection.html("<i class='fas fa-exclamation-circle'></i>  Can't connect to the source using this connection string");
    //    }

    //    this.btnTestConnection.enable();
    //}
}

// @ts-check

class dataSourceEdit {

    constructor() {
    }

    async onLoad() {

        this.engineId = $("#DataSourceView_EngineId").val();

        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {
                evt.preventDefault();

                if (this.engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${this.engineId}/test`);
            });
        }

        this.$sourceCode = $("#sourceCode");

        let jsonObjectString = $("#DataSourceView_JsonString").val();

        if (jsonObjectString && jsonObjectString.length) {

            var o = JSON.parse(jsonObjectString);
            let jsonString = Prism.highlight(JSON.stringify(o, null, 2), Prism.languages.json, 'json');

            let $sourceCode = $("#sourceCode");

            if ($sourceCode)
                $sourceCode.html(jsonString);

        }

    }




}

// @ts-check

class entitiesPage {

    constructor() {

    }

    async onPostBody(data) {
        if (data && data.length > 0) {
            this.engine = data[0];
            this.$enginesTable.bootstrapTable('check', 0);
        }
    }

    async onClickRow(row) {
        this.engine = row;
        await this.loadEntitiesAsync(this.engine);
    }


    async onLoad() {

        // get table
        this.$enginesTable = $("#enginesTable");

        if (!this.$enginesTable)
            return;

        setEngineBootstrapTable(this.$enginesTable, '/entities/index/engines', true,
            (data) => this.onPostBody(data),
            (row) => this.onClickRow(row));

        this.$entitiesTable = $("#entitiesTable");

        this.$entitiesTable.bootstrapTable({
            formatNoMatches: () => { return 'Please select a running engine to see all the entities.'; }
        });

        this.$entitiesTable.on('click-row.bs.table', (row, $element, field) => {
            window.location.href = `/Entities/Edit/${this.engine.id}/${$element.name}`;
        });
    }

 


    async loadEntitiesAsync(engine) {

        this.$entitiesTable.bootstrapTable('showLoading');
        let data_url = `/entities/index/entities?engineId=${engine.id}`;
        let entitiesResponse = await fetch(data_url);
        this.entities = await entitiesResponse.json();

        if (!this.entities)
            this.entities = [];

        this.$entitiesTable.bootstrapTable('updateFormatText', 'formatNoMatches',
            `No entities for engine <strong>${engine.engineName}</strong>. <a href='/entities/new'>Create a new entity</a> for your engine`);

        this.$entitiesTable.bootstrapTable('load', this.entities);

        this.$entitiesTable.bootstrapTable('hideLoading');

    }


    async onUnLoad() {

    }
}

// @ts-check

class entitiesAzureSql {

    constructor() {
        this.isLoaded = false;
    }
	/**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     */
    async loadAsync(htmlFieldPrefix, element, engineId) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/entities/new/entities?dvt=AzureSqlTable&engineId=${engineId}`);
        }

        // get errors labels
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        this.$labelErrorTables = $("#labelErrorTables");

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshTablesAsync(engineId); });

        this.$tablesSelect = $(`#${this.htmlFieldPrefix}TableName`);
        this.$tablesSelectString = $(`#${this.htmlFieldPrefix}TablesItemsString`);
        // on table change, set the correct attributes for the preview button
        this.$tablesSelect.change(() => { this.setPreviewDataAttributes(engineId); });

        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }

        this.isLoaded = true;
    }

    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();
        this.$labelErrorTables.empty();


        let dataSourcesUrl = `/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureSqlDatabase`;
        let r = await fetch(dataSourcesUrl);
        let dataSources = [];

        if (r.status >= 400) {
            var text = await r.json();
            this.$labelErrorDataSources.text(text.error.message);
            return;
        }

        if (r.status != 400) {
            let dataSourcesJson = await r.json();

            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }));
            });
        }

        if (!dataSources.length) {
            this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
            this.$dataSourcesSelectString.val('');

        } else {
            this.$dataSourcesSelectString.val(dataSources.join());

        }

        this.$dataSourcesSelect.enablePicker();

        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

        if (dataSourceSelected)
            await this.refreshTablesAsync(engineId);

    }

    async refreshTablesAsync(engineId) {
        this.$labelErrorTables.empty();

        this.$tablesSelect.disablePicker("loading tables ...");

        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

        let tables = [];

        let tablesUrl = `/api/AzureSqlDatabase/${engineId}/${dataSourceSelected}/tables`;
        let r = await fetch(tablesUrl);

        if (r.status >= 400) {
            var text = await r.json();
            this.$labelErrorTables.text(text.error.message);
            return;
        }

        if (r.status != 400) {
            let tablesJson = await r.json();

            tables = tablesJson.map(item => `${item.schemaName}.${item.tableName}`);

            $.each(tables, (i, item) => {
                this.$tablesSelect.append($('<option>', { value: item, text: item }));
            });
        }

        if (!tables.length) {
            this.$tablesSelect.data("noneSelectedText", "No Tables...");
            this.$tablesSelectString.val('');
        }
        else {
            this.$tablesSelectString.val(tables.join());
        }

        this.$tablesSelect.enablePicker();

        var tableSelected = $(`#${this.htmlFieldPrefix}TableName option:selected`).val();

        if (tableSelected)
            this.setPreviewDataAttributes(engineId);

    }

    setPreviewDataAttributes(engineId) {
        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

        if (!dataSourceSelected?.length)
            return;

        var tableSelected = $(`#${this.htmlFieldPrefix}TableName option:selected`).val();

        if (!tableSelected?.length)
            return;

        var tableTab = tableSelected.split(".");
        var schemaName = tableTab[0];
        var tableName = tableTab[1];

        // before refreshing columns, add data to preview buttons
        let $previewEntityButton = $("#previewEntityButton");
        $previewEntityButton.data("engine-id", engineId);
        $previewEntityButton.data("data-source-name", dataSourceSelected);
        $previewEntityButton.data("schema-name", schemaName);
        $previewEntityButton.data("table-name", tableName);
        $previewEntityButton.data("title", `Table preview [${schemaName}].[${tableName}]`);

    }

}

// @ts-check

class entitiesDelimitedText {

    constructor() {
        this.isLoaded = false;
    }

    /**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     */
    async loadAsync(htmlFieldPrefix, element, engineId) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/entities/new/entities?dvt=DelimitedText&engineId=${engineId}`);
        }

        // transform all select picker into selectpicker
        $('select').selectpicker();

        this.$labelErrorDataSources = $("#labelErrorDataSources");

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);

        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
        this.isLoaded = true;
    }


    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();


        let dataSourcesUrl = `/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureSqlDatabase`;
        let r = await fetch(dataSourcesUrl);
        let dataSources = [];

        if (r.status >= 400) {
            var text = await r.json();
            this.$labelErrorDataSources.text(text.error.message);
            return;
        }

        if (r.status != 400) {
            let dataSourcesJson = await r.json();

            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }));
            });
        }

        if (!dataSources.length) {
            this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
            this.$dataSourcesSelectString.val('');

        } else {
            this.$dataSourcesSelectString.val(dataSources.join());

        }

        this.$dataSourcesSelect.enablePicker();

        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

    }
}

// @ts-check

class entitiesNewPage extends wizardPage {

    constructor() {
        super('EntityView', '/entities/new/engines');

        this.entitiesAzureSql = new entitiesAzureSql();
        this.entitiesDelimitedText = new entitiesDelimitedText();
        this.lastTypeSelected = '';
}

    async onLoad() {
        // call base onLoad method
        super.onLoad();

        // init preview panel
        modalPanelPreview.initialize("panelPreview");

        // transform all select picker into selectpicker
        $('select').selectpicker();

        this.$smartWizard.on("stepContent", async (e, anchorObject, stepNumber, stepDirection) => {

            if (stepNumber == 2) {

                try {

                    if (this.$engineIdElement) {
                        let engineId = this.$engineIdElement.val().toString();

                        if (!engineId?.length) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }

                        let type = $(`input[name="EntityView.EntityType"]:checked`).val();

                        if (!type) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }

                        if (this.lastTypeSelected === type.toString())
                            return;

                        this.lastTypeSelected = type.toString();

                        if (type == 'AzureSqlTable')
                            await this.entitiesAzureSql.loadAsync(this.htmlFieldPrefix, this.$properties, engineId);

                        if (type == 'DelimitedText')
                            await this.entitiesDelimitedText.loadAsync(this.htmlFieldPrefix, this.$properties, engineId);

                    }

                } catch (e) {

                    this.$smartWizard.smartWizard("goToStep", 0);
                }
            }
        });
    }



    async onUnLoad() {

    }
}

// @ts-check

let jqueryExtends = function () {

    // extend picker
    $.fn.extend({
        disablePicker: function (msg) {
            this.empty();
            this.attr("disabled", "true");
            this.data("noneSelectedText", msg);
            this.selectpicker('refresh');
        }
    });

    $.fn.extend({
        enablePicker: function () {
            this.removeAttr("disabled");
            this.selectpicker('refresh');
        }
    });


    // extend enable disable of buttons and a href
    $.fn.extend({
        enable: function () {
            this.removeClass('disabled');
            this.prop('disabled', false);
        },
        disable: function () {
            this.addClass('disabled');
            this.prop('disabled', true);
        }
    });



    // extend load async
    $.fn.extend({
        loadAsync: function (data_url) {
            return new Promise((resolve, reject) => {
                this.load(data_url, (response, status, xhr) => {
                    if (status == "error") {
                        reject(response);
                    }
                    resolve(response);
                });
            });
        }
    });

    $.fn.extend({
        testAsync: async function (url) {

            // this is the button which clicked !
            let $btn = this;

            this.parent().removeClass('d-flex align-items-baseline text-nowrap').addClass('d-flex align-items-baseline text-nowrap');

            let btnId = $btn.attr('id');
            let spinnerId = `${btnId}Spinner`;
            let messageId = `${btnId}Message`;

            let $spinnerSpan = $(`#${spinnerId}`);
            let $messageSpan = $(`#${messageId}`);

            if (!$spinnerSpan.length)
                $btn.after(`<span id=${spinnerId} style="display:none;" class="ml-2"><i class="fas fa-spinner fa-spin"></i></span>`);

            $spinnerSpan = $(`#${spinnerId}`);

            if (!$messageSpan.length)
                $spinnerSpan.after(`<span id=${messageId} style="display:none;" class="ml-2"></span>`);

            $messageSpan = $(`#${messageId}`);

            $messageSpan.hide();
            $spinnerSpan.show();

            let r = await $btn.postAsync(url, false);

            $spinnerSpan.hide();

            if (r.errors || r === false) {

                let errors = [];

                if (r && r.errors) {
                    errors = Object.values(r.errors).flatMap(e => e);
                } else {
                    errors = ["Can't connect"];
                }

                let html = `<i class="fas fa-exclamation"></i> ${errors[0]}`;
                $messageSpan.html(html);
                $messageSpan.addClass("text-danger").removeClass("text-success");
            } else {
                let html = '<i class="fas fa-check"></i> connection successful';
                $messageSpan.html(html);
                $messageSpan.addClass("text-success").removeClass("text-danger");
            }
            $messageSpan.show();

        }
    });

    $.fn.extend({
        postAsync: async function (url, checkIsValid) {

            if (!$("form"))
                return;

            if (checkIsValid) {
                // Launch a validation before
                let isValid = $("form").valid();

                if (!isValid)
                    return;
            }

            let formValues = $('form').serializeArray();

            var formdata = new FormData();
            $.each(formValues, function (i, v) {
                formdata.append(v.name, v.value);
            });

            try {

                let response = await fetch(url, {
                    body: formdata,
                    method: 'POST'
                });

                let responseJson = await response.json();

                if (response.status >= 400 || responseJson === false) {

                    if (checkIsValid) {

                        var container = $(document).find("[data-valmsg-summary=true]"),
                            list = container.find("ul");

                        let errors = [];

                        if (responseJson && responseJson.errors) {
                            errors = Object.values(responseJson.errors).flatMap(e => e);
                        } else {
                            errors = ["Can't connect"];
                        }

                        if (list && list.length) {
                            list.empty();
                            container.addClass("validation-summary-errors").removeClass("validation-summary-valid");

                            $.each(errors, function () {
                                $("<li />").html(this).appendTo(list);
                            });
                        }

                    }
                }
                return responseJson;
            } catch (e) {
                return {
                    errors: {
                        serverException: [e]
                    }
                };
            }

        }
    });
};



//async postAsync() {
//    // First, save the deployment.

//    let token = $('input[name="__RequestVerificationToken"]').val();

//    let response = await fetch('', {
//        method: 'POST',
//        body: `dataSourceView.EngineId=${this.dataSourceView.engineId}` +
//            `&dataSourceView.DataSourceType=${this.dataSourceView.dataSourceType}` +
//            `&dataSourceView.ConnectionString=${this.dataSourceView.connectionString}` +
//            `&__RequestVerificationToken=${token}`,
//        headers: {
//            "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
//        }
//    });

//}

(jqueryExtends)();

// @ts-check

dotmimtable.initialize();

// Initialize home page to register notifications
homePage.current.initialize();

// Initialize auth helper
auth.current.initialize();


mgtloader.setMgtProvider();
mgtloader.interceptMgtLogin();

router$1.register('/Dashboard', dashboardPage);
router$1.register('/Dashboard/Index', dashboardPage);
router$1.register('/Engines', enginesPage);
router$1.register('/Engines/Index', enginesPage);
router$1.register('/Engines/Details', engineDetailsPage);
router$1.register('/Admin/Index', adminPage);
router$1.register('/Admin', adminPage);
router$1.register('/Settings/Index', settingsPage);
router$1.register('/Settings', settingsPage);
router$1.register('/Admin/Details', adminEngineRequestDetailsPage);
router$1.register('/Admin/Deploy', adminDeploymentEnginePage);
router$1.register('/DataSources', dataSourcesPage);
router$1.register('/DataSources/New', dataSourceNew);
router$1.register('/DataSources/Edit', dataSourceEdit);
router$1.register('/Entities', entitiesPage);
router$1.register('/Entities/New', entitiesNewPage);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIkNsaWVudFNyYy9yb3V0ZXIuanMiLCJDbGllbnRTcmMvZGFzaGJvYXJkL2Rhc2hib2FyZFBhZ2UuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVzUGFnZS5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsLmpzIiwiQ2xpZW50U3JjL2NvbnNvbGUyLmpzIiwiQ2xpZW50U3JjL2hlbHBlcnMuanMiLCJDbGllbnRTcmMvaGFuZGxlcnMuanMiLCJDbGllbnRTcmMvbm90aWZpY2F0aW9uLmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxEZWxldGVFbmdpbmUuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFicmlja3MuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFGYWN0b3J5LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxQcmV2aWV3LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxVc2Vycy5qcyIsIkNsaWVudFNyYy9lbmdpbmVzL2VuZ2luZURldGFpbHNQYWdlLmpzIiwiQ2xpZW50U3JjL2RvdG1pbXRhYmxlLmpzIiwiQ2xpZW50U3JjL2FkbWluL2FkbWluUGFnZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlLmpzIiwiQ2xpZW50U3JjL2FkbWluL2FkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlLmpzIiwiQ2xpZW50U3JjL21ndC5qcyIsIkNsaWVudFNyYy9hdXRoLmpzIiwiQ2xpZW50U3JjL2hvbWUvaG9tZVBhZ2UuanMiLCJDbGllbnRTcmMvc2V0dGluZ3Mvc2V0dGluZ3NQYWdlLmpzIiwiQ2xpZW50U3JjL2Jvb3RzdHJhcFRhYmxlcy9lbmdpbmVCb290c3RyYXBUYWJsZS5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlc1BhZ2UuanMiLCJDbGllbnRTcmMvd2l6YXJkL3dpemFyZFBhZ2UuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUF6dXJlU3FsLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZU5ldy5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlRWRpdC5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc1BhZ2UuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNBenVyZVNxbC5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc0RlbGltaXRlZFRleHQuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNOZXdQYWdlLmpzIiwiQ2xpZW50U3JjL2V4dGVuc2lvbnMuanMiLCJDbGllbnRTcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gQHRzLWNoZWNrIFxyXG5cclxuZXhwb3J0IGNsYXNzIHJvdXRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAocHNlKSA9PiB0aGlzLl9vbkxvY2F0aW9uQ2hhbmdlKHBzZSkpO1xyXG5cclxuICAgICAgICB0aGlzLl9pbml0KGxvY2F0aW9uLmhyZWYpO1xyXG5cclxuICAgICAgICAvLyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcclxuICAgICAgICAvLyBldmVudCBhZnRlciBhbiBoaXN0b3J5IGNhbGxiYWNrIHdoaXRoIHBvcHN0YXRlXHJcbiAgICAgICAgJCgoKSA9PiB0aGlzLl9ydW4oKSk7XHJcblxyXG5cclxuICAgIH1cclxuICBcclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZ2V0IHRoZSBjdXJyZW50IHZpZXcgbmFtZSAodGhlIC97Vmlld30gbmFtZSBwYWdlKVxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VmlldygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VmlldztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHt7W119fSBnZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAqL1xyXG4gICAgZ2V0UXVlcnlQYXJhbWV0ZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge1VSTH0gZ2V0IHRoZSBjdXJyZW50IHVybFxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VXJsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBnZXQgdGhlIGN1cnJlbnQgc3RhdGUgKHVzZWx5IGFmdGVyIGEgcG9zdCwgYW5kIGRlY2xhcmVkIGZyb20gdGhlIG5vZGUgdmlldyBpbiB7c3RhdGV9IG9iamVjdClcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFN0YXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0IHRoZSByb3V0ZXIgb24gZWFjaCB1cmwgcmVxdWVzdGVkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jIGN1cnJlbnQgbG9jYXRpb24gaHJlZlxyXG4gICAgICovXHJcbiAgICBfaW5pdChsb2MpIHtcclxuICAgICAgICAvL3RoaXMuY3VycmVudFVybCA9IG5ldyB1cmlqcyhsb2MpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVybCA9IG5ldyBVUkwobG9jKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IHZpZXdcclxuICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdGhpcy5jdXJyZW50VXJsLnBhdGhuYW1lO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAgICB0aGlzLmN1cnJlbnRVcmwuc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge1BvcFN0YXRlRXZlbnR9IHBvcFN0YXRlRXZlbnQgXHJcbiAgICAqL1xyXG4gICAgX29uTG9jYXRpb25DaGFuZ2UocG9wU3RhdGVFdmVudCkge1xyXG4gICAgICAgIHZhciBzcmNFbGVtID0gcG9wU3RhdGVFdmVudC5zcmNFbGVtZW50O1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKCFzcmNFbGVtIHx8ICFzcmNFbGVtLmxvY2F0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlICYmIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQpXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKTtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX2luaXQoc3JjRWxlbS5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB0aGlzLl9ydW4oKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgX2NyZWF0ZUluc3RhbmNlKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgdmFyIGZhY3RvcnkgPSBjb25zdHJ1Y3Rvci5iaW5kLmFwcGx5KGNvbnN0cnVjdG9yLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgZmFjdG9yeSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3N0YXRlXSBcclxuICAgICAqL1xyXG4gICAgbmF2aWdhdGVUbyh1cmwsIHN0YXRlKSB7XHJcblxyXG4gICAgICAgIGlmICh1cmwgPT09IHRoaXMuY3VycmVudFVybC5wYXRobmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUgPyBzdGF0ZSA6IHt9LCBcIlwiLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aE5hbWUgOiBwYXRobmFtZSB1cmlcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHBhZ2VIYW5kbGVyXHJcbiAgICAqL1xyXG4gICAgcmVnaXN0ZXIocGF0aE5hbWUsIHBhZ2VIYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0KHBhdGhOYW1lLCBwYWdlSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgX3J1bigpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gJChcIiNyb3V0ZXJTdGF0ZVwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IEpTT04ucGFyc2UodGhpcy5jdXJyZW50U3RhdGUpO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudEtleTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXAuZm9yRWFjaCgodiwgaykgPT4ge1xyXG4gICAgICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAoaywgJ2knKTtcclxuICAgICAgICAgICAgbGV0IGlzTWF0Y2ggPSByLnRlc3QodGhpcy5jdXJyZW50Vmlldyk7XHJcbiAgICAgICAgICAgIGlmIChpc01hdGNoKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudEtleSA9IGs7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50S2V5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50UGFnZUN0b3IgPSB0aGlzLm1hcC5nZXQoY3VycmVudEtleSk7XHJcblxyXG4gICAgICAgIGlmICghY3VycmVudFBhZ2VDdG9yKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLl9jcmVhdGVJbnN0YW5jZShjdXJyZW50UGFnZUN0b3IpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFBhZ2UpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2Uub25Mb2FkKSB7XHJcbiAgICAgICAgICAgICQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZS5vbkxvYWQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlciBoYXMgbG9hZGVkIHBhZ2UgXCIgKyB0aGlzLmN1cnJlbnRWaWV3KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZS5vblVubG9hZCkge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ2JlZm9yZXVubG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLy8gc2luZ2xldG9uXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyByb3V0ZXIoKTtcclxuXHJcblxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vcm91dGVyLmpzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIGRhc2hib2FyZFBhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSW5kZXggZ2V0IHRoZSBjdXJyZW50IHBhZ2UgaW5kZXhcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaChwYWdlSW5kZXgpIHtcclxuICAgIH1cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBlbmdpbmVzUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9zaG93blBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9zaG93UGFuZWwgPSAoZSkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMuX3VubG9hZFBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBcInJpZ2h0XCI7XHJcbiAgICAgICAgdGhpcy5fY2VudGVyID0gXCJcIjtcclxuXHJcbiAgICAgICAgJCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtb2RhbEh0bWxEaXYgPSB0aGlzLmdlbmVyYXRlTW9kYWxIdG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKG1vZGFsSHRtbERpdik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhbmVsKCkub24oJ3Nob3duLmJzLm1vZGFsJywgdGhpcy5fc2hvd25QYW5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwoKS5vbignc2hvdy5icy5tb2RhbCcsIHRoaXMuX3Nob3dQYW5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwoKS5vbignaGlkZS5icy5tb2RhbCcsIHRoaXMuX3VubG9hZFBhbmVsKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIHNtKCkge1xyXG4gICAgICAgIHRoaXMuX2xhcmdlID0gXCJcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIGxnKCkge1xyXG4gICAgICAgIHRoaXMuX2xhcmdlID0gXCIgbW9kYWwtbGdcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgeGwoKSB7XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIiBtb2RhbC14bFwiO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gXCJcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIHJlYWRvbmx5KCkge1xyXG4gICAgICAgIHRoaXMuX2RhdGFfcmVhZG9ubHkgPSAnZGF0YS1iYWNrZHJvcD1cInN0YXRpY1wiIGRhdGEta2V5Ym9hcmQ9XCJmYWxzZVwiICc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2VudGVyKCkge1xyXG4gICAgICAgIHRoaXMuX2NlbnRlciA9IFwibW9kYWwtZGlhbG9nLWNlbnRlcmVkIG1vZGFsLWRpYWxvZy1zY3JvbGxhYmxlXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICpcclxuICAgICogQGNhbGxiYWNrIG9uTW9kYWxFdmVudFxyXG4gICAgKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50XHJcbiAgICAqL1xyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge29uTW9kYWxFdmVudH0gc2hvd25QYW5lbEV2ZW50IC0gQ2FsbGVkIHdoZW4gdGhlIHBhbmVsIGlzIHNob3duLlxyXG4gICAgICovXHJcbiAgICBvblNob3duKHNob3duUGFuZWxFdmVudCkgeyB0aGlzLl9zaG93blBhbmVsID0gc2hvd25QYW5lbEV2ZW50OyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge29uTW9kYWxFdmVudH0gc2hvd1BhbmVsRXZlbnQgLSBDYWxsZWQgd2hlbiB0aGUgcGFuZWwgaXMgbG9hZGluZywgYmVmb3JlIHNob3duLlxyXG4gICAgICovXHJcbiAgICBvblNob3coc2hvd1BhbmVsRXZlbnQpIHsgdGhpcy5fc2hvd1BhbmVsID0gc2hvd1BhbmVsRXZlbnQ7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7b25Nb2RhbEV2ZW50fSB1bmxvYWRQYW5lbEV2ZW50IC0gQ2FsbGVkIHdoZW4gdGhlIHBhbmVsIGlzIHVubG9hZGluZy5cclxuICAgICAqL1xyXG4gICAgb25VbkxvYWQodW5sb2FkUGFuZWxFdmVudCkgeyB0aGlzLl91bmxvYWRQYW5lbCA9IHVubG9hZFBhbmVsRXZlbnQ7IH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRWxlbWVudD59ICovXHJcbiAgICBwYW5lbCgpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9YCkgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0gKi9cclxuICAgIHN1Ym1pdEJ1dHRvbigpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9U3VibWl0QnV0dG9uYCkgfVxyXG5cclxuICAgIC8qKiAgQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59ICovXHJcbiAgICBkZWxldGVCdXR0b24oKSB7XHJcbiAgICAgICAgcmV0dXJuICQoYCMke3RoaXMuaWR9RGVsZXRlQnV0dG9uYClcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVCdXR0b25UZXh0KHRleHQpIHtcclxuICAgICAgICAkKGAjJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblRleHRgKS50ZXh0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59Ki9cclxuICAgIGNsb3NlQnV0dG9uKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1DbG9zZUJ1dHRvbmApIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGJvZHkoKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfUJvZHlgKSB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtKUXVlcnk8SFRNTEhSRWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRpdGxlKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1UaXRsZWApIH1cclxuXHJcblxyXG4gICAgZ2VuZXJhdGVNb2RhbEh0bWwoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RhbCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgJHt0aGlzLl9wb3NpdGlvbn0gZmFkZVwiIGlkPVwiJHt0aGlzLmlkfVwiIHRhYmluZGV4PVwiLTFcIiAke3RoaXMuX2RhdGFfcmVhZG9ubHl9YXJpYS1sYWJlbGxlZGJ5PVwiJHt0aGlzLmlkfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nJHt0aGlzLl9sYXJnZX0gJHt0aGlzLl9jZW50ZXJ9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCR7dGhpcy5fbGFyZ2V9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiIGlkPVwiJHt0aGlzLmlkfVRpdGxlXCI+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiIGlkPVwiJHt0aGlzLmlkfUJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYXJrIGJ0bi1zbVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgaWQ9XCIke3RoaXMuaWR9Q2xvc2VCdXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXVuZG9cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDbG9zZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgaWQ9XCIke3RoaXMuaWR9U3VibWl0QnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zYXZlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3VibWl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi1zbVwiIGlkPVwiJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJhc2gtYWx0XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCIke3RoaXMuaWR9RGVsZXRlQnV0dG9uVGV4dFwiPkRlbGV0ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGFsO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu79cclxuXHJcbmV4cG9ydCBjbGFzcyBjb25zb2xlMiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxEaXZFbGVtZW50Pn0gcGFyZW50T3ZlcmZsb3dFbGVtZW50XHJcbiAgICAgKiovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBwYXJlbnRPdmVyZmxvd0VsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxUb3AgPSB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQucG9zaXRpb24oKS50b3A7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cuUHJpc20gPSB3aW5kb3cuUHJpc20gfHwge307XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHdpbmRvdy5QcmlzbS5tYW51YWwgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLl9tZ3Rsb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZ3Rsb2dpbicpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBfdXNlck5hbWUoKSB7XHJcblxyXG4gICAgICAgIGxldCB1c2VyTmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9tZ3Rsb2dpbiAmJiB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscykge1xyXG5cclxuICAgICAgICAgICAgbGV0IG1haWwgPSB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgaWYgKCFtYWlsKVxyXG4gICAgICAgICAgICAgICAgbWFpbCA9IHRoaXMuX21ndGxvZ2luLnVzZXJEZXRhaWxzLnVzZXJQcmluY2lwYWxOYW1lO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5hbWVNYXRjaCA9IG1haWwubWF0Y2goL14oW15AXSopQC8pO1xyXG4gICAgICAgICAgICB1c2VyTmFtZSA9IG5hbWVNYXRjaCA/IG5hbWVNYXRjaFsxXSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdXNlck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3Njcm9sbFRvRW5kKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9jb25zb2xlMi5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbmV3UG9zID0gdGhpcy5faW5pdGlhbFRvcCArIGhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50LnNjcm9sbFRvKG5ld1BvcywgMTAwKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kT2JqZWN0KGpzb25PYmplY3QpIHtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxldCBqc29uU3RyaW5nID0gUHJpc20uaGlnaGxpZ2h0KEpTT04uc3RyaW5naWZ5KGpzb25PYmplY3QsIG51bGwsIDIpLCBQcmlzbS5sYW5ndWFnZXMuanNvbiwgJ2pzb24nKTtcclxuXHJcbiAgICAgICAgbGV0IHN0ciA9IFwiPHByZSBjbGFzcz0nbWwtMyBtci0zIG10LTMnIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOndoaXRlO3doaXRlLXNwYWNlOnByZS13cmFwO3dpZHRoOjkwJTttYXgtaGVpZ2h0OjI1MHB4Oyc+PGNvZGU+XCI7XHJcbiAgICAgICAgc3RyICs9IGpzb25TdHJpbmc7XHJcbiAgICAgICAgc3RyICs9IFwiPC9jb2RlPjwvcHJlPlwiO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFwcGVuZFdhcm5pbmcobGluZSkge1xyXG5cclxuICAgICAgICBsZXQgc3RyID0gYDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3dcIj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdhcm5pbmdcIj4ke3RoaXMuX3VzZXJOYW1lKCl9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj46PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2FybmluZ1wiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRFcnJvcihsaW5lKSB7XHJcblxyXG4gICAgICAgIGxldCBzdHIgPSBgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvd1wiPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2cobGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGluZm8obGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGVycm9yKGxpbmUpIHsgdGhpcy5hcHBlbmRFcnJvcihsaW5lKTsgfVxyXG4gICAgd2FybihsaW5lKSB7IHRoaXMuYXBwZW5kV2FybmluZyhsaW5lKTsgfVxyXG5cclxuXHJcbiAgICBhcHBlbmRMaW5lKGxpbmUpIHtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHN0ciA9IGA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93XCI+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuLy9leHBvcnQgZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4vLyAgICB0aGlzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4vLyAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4vL31cclxuLy9leHBvcnQgZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuLy8gICAgdGhpcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuLy8gICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG5cclxuLy99XHJcblxyXG4vLy8qKlxyXG4vLyAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhX3VybFxyXG4vLyAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4vLyAqL1xyXG4vL2V4cG9ydCBmdW5jdGlvbiBsb2FkUGFydGlhbEFzeW5jKGRhdGFfdXJsLCBlbGVtZW50KSB7XHJcbi8vICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbi8vICAgICAgICBlbGVtZW50LmxvYWQoZGF0YV91cmwsIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpID0+IHtcclxuLy8gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4vLyAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4vLyAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuLy8gICAgICAgIH0pO1xyXG4vLyAgICB9KTtcclxuLy99XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgaGFuZGxlcnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWV0aG9kcyA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdNZXRob2RcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lIHx8ICFuZXdNZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gaGFuZGxlcnMgYWxyZWFkeSwgY3JlYXRlIGFuIGVtcHR5IGFycmF5XHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0pIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQcmV2ZW50aW5nIGFkZGluZyB0aGUgc2FtZSBoYW5kbGVyIG11bHRpcGxlIHRpbWVzLlxyXG4gICAgICAgIGlmICh0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0uaW5kZXhPZihuZXdNZXRob2QpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgdGhlIG1ldGhvZCB0byB0aGUgaGFuZGxlciBsaXN0XHJcbiAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdLnB1c2gobmV3TWV0aG9kKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGFuIGhhbmRsZXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIG1ldGhvZCBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gbWV0aG9kICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kTmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIGdldCBhbGwgaGFuZGxlcnMgd2l0aCB0aGlzIG1ldGhvZCBuYW1lXHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcblxyXG4gICAgICAgIC8vIGlmIGhhbmRsZXJzIGRvIG5vdCBleGlzdHMsIHJldHVyblxyXG4gICAgICAgIGlmICghaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uIGV4aXN0aW5nXHJcbiAgICAgICAgaWYgKG1ldGhvZCkge1xyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiBhbGwgaGFuZGxlcnNcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlSWR4ID0gaGFuZGxlcnMuaW5kZXhPZihtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgd2UgZm91bmQgaXQsIG1ha2UgYSBzcGxpY2UgaW4gdGhlIGhhbmRsZXJzIGxpc3RcclxuICAgICAgICAgICAgaWYgKHJlbW92ZUlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShyZW1vdmVJZHgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIG5vIG1vcmUgaGFuZGxlcnMsIGRlbGV0ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0ICAgXHJcbiAgICAgKi9cclxuICAgIGludm9rZSh0YXJnZXQsIC4uLnBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBtZXRob2RzIGFycmF5IHRvIGludm9rZVxyXG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLm1ldGhvZHNbdGFyZ2V0LnRvTG93ZXJDYXNlKCldO1xyXG5cclxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uIG1ldGhvZCBpbiB0aGUgbWV0aG9kcyBhcnJheSB0byBpbnZva2VcclxuICAgICAgICBpZiAobWV0aG9kcykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG0uYXBwbHkoX3RoaXMsIHBhcmFtZXRlcnMpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBIGNhbGxiYWNrIGZvciB0aGUgbWV0aG9kICR7dGFyZ2V0LnRvTG93ZXJDYXNlKCl9IHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTm8gY2xpZW50IG1ldGhvZCB3aXRoIHRoZSBuYW1lICcke3RhcmdldC50b0xvd2VyQ2FzZSgpfScgZm91bmQuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vd3d3cm9vdC9saWIvc2lnbmFsci9kaXN0L2Jyb3dzZXIvc2lnbmFsci5qc1wiIC8+XHJcblxyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuL2hlbHBlcnMuanNcIjtcclxuaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tIFwiLi9oYW5kbGVycy5qc1wiXHJcblxyXG4vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBub3RpZmljYXRpb24ge1xyXG5cclxuICAgIC8vIHNpbmdsZXRvblxyXG4gICAgc3RhdGljIF9jdXJyZW50O1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7bm90aWZpY2F0aW9ufSAqL1xyXG4gICAgc3RhdGljIGdldCBjdXJyZW50KCkge1xyXG4gICAgICAgIGlmICghbm90aWZpY2F0aW9uLl9jdXJyZW50KVxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uX2N1cnJlbnQgPSBuZXcgbm90aWZpY2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uX2N1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvLyBldmVudHNcclxuICAgIHN0YXRpYyBPblN0YXJ0ZWQgPSBcIk9uU3RhcnRlZFwiO1xyXG4gICAgc3RhdGljIE9uU3RvcHBlZCA9IFwiT25TdG9wcGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0ZWQgPSBcIk9uQ29ubmVjdGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0aW5nID0gXCJPbkNvbm5lY3RpbmdcIjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlcnMgPSBuZXcgaGFuZGxlcnMoKTtcclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IHNpZ25hbFIuSHViQ29ubmVjdGlvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAuY29uZmlndXJlTG9nZ2luZyhzaWduYWxSLkxvZ0xldmVsLk5vbmUpXHJcbiAgICAgICAgICAgIC53aXRoVXJsKCcvbm90aWZpY2F0aW9ucycpXHJcbiAgICAgICAgICAgIC53aXRoQXV0b21hdGljUmVjb25uZWN0KClcclxuICAgICAgICAgICAgLmNvbmZpZ3VyZUxvZ2dpbmcoc2lnbmFsUi5Mb2dMZXZlbC5UcmFjZSlcclxuICAgICAgICAgICAgLmJ1aWxkKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbnJlY29ubmVjdGluZyhlcnJvciA9PiB0aGlzLl9jb25zb2xlLmxvZyhlcnJvcikpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbmNsb3NlKGVycm9yID0+IHRoaXMub25Db25uZWN0aW9uRXJyb3IoZXJyb3IpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uKFwiY29ubmVjdGVkXCIsIChfKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgICAgIGxldCByZXRyeUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3RhcnRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaWxlICghdGhpcy5faXNDb25uZWN0ZWQgJiYgcmV0cnlDb3VudCA8IDUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHJ5Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgPT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZyk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc3RhcnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgZGVsYXkoMTUwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkIHx8IHJldHJ5Q291bnQgPj0gNSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXJ0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IHRyaWVzIHRvIGNvbm5lY3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uU3RhcnRlZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgIT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLmludm9rZShub3RpZmljYXRpb24uT25TdG9wcGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9uKG1ldGhvZCwgaGFuZGxlcik7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub24obWV0aG9kLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBvbkNvbm5lY3Rpb25FcnJvcihlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciAmJiBlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUge1xyXG5cclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxEZWxldGVFbmdpbmUobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5jbGljayhhc3luYyAoZXZlbnQpID0+IHsgYXdhaXQgdGhpcy5kZWxldGVFbmdpbmVBc3luYyhldmVudCkgfSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmRlbGV0ZUNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgICAgIC8vIHN1YnNjcmliZSB0byBldmVudCBmcm9tIHNpZ25hbHIgYWJvdXQgZGVwbG95bWVudFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0YXJ0ZWQuXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RpbmcuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0b3BwZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RvcHBlZC5cIikpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0UmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlcXVlc3RSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICQobG9jYXRpb24pLmF0dHIoJ2hyZWYnLCAnL0FkbWluL0luZGV4Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0ID0gYXdhaXQgZW5naW5lUmVxdWVzdFJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lUmVxdWVzdCkge1xyXG4gICAgICAgICAgICAkKGxvY2F0aW9uKS5hdHRyKCdocmVmJywgJy8nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5zaG93KCk7XHJcblxyXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdtLTInPkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgZW5naW5lIDxiPlwiICsgZW5naW5lUmVxdWVzdC5lbmdpbmVOYW1lICsgXCI8L2I+ID88L2Rpdj5cIikuaW5zZXJ0QmVmb3JlKHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIlJlYWR5IHRvIGRlbGV0ZS4gUGxlYXNlIHByZXNzICdEZWxldGUnIGJ1dHRvbiB0byBzdGFydC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7SlF1ZXJ5LkNsaWNrRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQsIG51bGwsIEhUTUxCdXR0b25FbGVtZW50LCBIVE1MQnV0dG9uRWxlbWVudD59IGV2dCAqL1xyXG4gICAgYXN5bmMgZGVsZXRlRW5naW5lQXN5bmMoZXZ0KSB7XHJcblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZW5naW5lSWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHRoZSBlbmdpbmUgcmVxdWVzdCBpZC4uLi5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBub3RpZmljYXRpb24gaGVscGVyXHJcbiAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIHRoaXMgZGVwbG95bWVudCAoZm9yIHRoaXMgdXNlcilcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5lbmdpbmVJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiV2FpdGluZyBmb3IgYW4gYWdlbnQgdG8gZW5xdWV1ZSB0aGUgZW5naW5lIGRyb3Agb3BlcmF0aW9uLi4uXCIpO1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBsZXQgdXJsRGVsZXRpb24gPSBgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmxEZWxldGlvbiwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBkZWxldGUgdGhlIGVuZ2luZSByZXF1ZXN0IHdpdGggSWQgJHt0aGlzLmVuZ2luZUlkfSBgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRyb3BFbmdpbmVTdGFydCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUoZHJvcEVuZ2luZVN0YXJ0KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9waW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwIDxzdHJvbmc+JHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9PC9zdHJvbmc+IC4uLmApXHJcblxyXG4gICAgICAgIGxldCByZ1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZ1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlR3JvdXAgPSBhd2FpdCByZ1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZUdyb3VwKTtcclxuXHJcbiAgICAgICAgbGV0IHJnTGlua1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9L2xpbmtgLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGlkOiByZXNvdXJjZUdyb3VwLmlkIH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZ0xpbmtSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCByZXNvdXJjZSBncm91cCBsaW5rLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXNvdXJjZUdyb3VwTGluayA9IGF3YWl0IHJnTGlua1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEF6dXJlIHJlc291cmNlIGdyb3VwIGxpbmsgOiA8YSBocmVmPSR7cmVzb3VyY2VHcm91cExpbmsudXJpfSB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlR3JvdXAubmFtZX08L2E+YClcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERvbmUuYClcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9waW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsRGF0YWJyaWNrcyB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbERhdGFicmlja3MobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwOiA8c3Ryb25nPiR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfTwvc3Ryb25nPi5gKVxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEYXRhYnJpY2tzIHdvcmtzcGFjZTogPHN0cm9uZz4ke2VuZ2luZS5jbHVzdGVyTmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEF6dXJlLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhYnJpY2tzLyR7ZW5naW5lLmlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhYnJpY2tzIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlID0gYXdhaXQgcmVzb3VyY2VSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QocmVzb3VyY2UpO1xyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VMaW5rUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX0vbGlua2AsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaWQ6IHJlc291cmNlLmlkIH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZUxpbmtSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCByZXNvdXJjZSBsaW5rLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmsgPSBhd2FpdCByZXNvdXJjZUxpbmtSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBBenVyZSBEYXRhYnJpa3Mgd29ya3NwYWNlIGxpbms6IDxhIGhyZWY9XCIke3Jlc291cmNlTGluay51cml9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRGF0YWJyaWNrcyB3b3Jrc3BhY2UgbGluazogPGEgaHJlZj1cImh0dHBzOi8vJHtyZXNvdXJjZS5wcm9wZXJ0aWVzLndvcmtzcGFjZVVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlLm5hbWV9PC9hPmApXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gRGF0YWJyaWNrcy4uLmApXHJcblxyXG4gICAgICAgIHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhYnJpY2tzLyR7ZW5naW5lLmlkfS9jbHVzdGVyYCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGRhdGFicmlja3MgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEb25lLmApXHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcGluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9wcGVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbERhdGFGYWN0b3J5IHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGF0YUZhY3RvcnkobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwIDxzdHJvbmc+JHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9PC9zdHJvbmc+IC4uLmApXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERhdGEgZmFjdG9yeSBWMjogPHN0cm9uZz4ke2VuZ2luZS5mYWN0b3J5TmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEF6dXJlLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lLmlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhIGZhY3RvcnkgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2UgPSBhd2FpdCByZXNvdXJjZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmtSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3Jlc291cmNlZ3JvdXBzLyR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfS9saW5rYCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZDogcmVzb3VyY2UuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlTGluayA9IGF3YWl0IHJlc291cmNlTGlua1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEF6dXJlIHJlc291cmNlIGdyb3VwIGxpbmsgOiA8YSBocmVmPSR7cmVzb3VyY2VMaW5rLnVyaX0gdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFByZXZpZXcge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFByZXZpZXcobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3ID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnhsKCkuY2VudGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxQcmV2aWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkudGV4dCgnTG9hZGluZyAuLi4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdmFyIGVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VOYW1lID0gYnV0dG9uLmRhdGEoJ2RhdGEtc291cmNlLW5hbWUnKVxyXG4gICAgICAgIHZhciBzY2hlbWFOYW1lID0gYnV0dG9uLmRhdGEoJ3NjaGVtYS1uYW1lJylcclxuICAgICAgICB2YXIgdGFibGVOYW1lID0gYnV0dG9uLmRhdGEoJ3RhYmxlLW5hbWUnKVxyXG5cclxuXHJcbiAgICAgICAgbGV0IHByZXZpZXdSb3dzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9BenVyZVNxbERhdGFiYXNlLyR7ZW5naW5lSWR9LyR7ZGF0YVNvdXJjZU5hbWV9L3RhYmxlcy8ke3NjaGVtYU5hbWV9LyR7dGFibGVOYW1lfS9wcmV2aWV3YCk7XHJcblxyXG4gICAgICAgIGlmIChwcmV2aWV3Um93c1Jlc3BvbnNlLnN0YXR1cyAhPSA0MDApIHtcclxuICAgICAgICAgICAgbGV0IHByZXZpZXdSb3dzID0gYXdhaXQgcHJldmlld1Jvd3NSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJldmlld1Jvd3MubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuYXBwZW5kKFwiPHRhYmxlIGlkPSd0YWJsZSc+PC90YWJsZT5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJvdzEgPSBwcmV2aWV3Um93c1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY29sdW1ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbyBpbiByb3cxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IG8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBvXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI3RhYmxlJykuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcHJldmlld1Jvd3NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkudGV4dCgnTm8gcm93cy4uLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFVzZXJzIHtcclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxVc2Vycyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnNtKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxVc2VycztcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkudGV4dCgnTG9hZGluZyAuLi4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcbiAgICAgICAgdmFyIHVzZXJzSWRzVmFsID0gYnV0dG9uLmRhdGEoJ3VzZXJzLWlkJykgLy8gRXh0cmFjdCBpbmZvIGZyb20gZGF0YS0qIGF0dHJpYnV0ZXNcclxuXHJcbiAgICAgICAgaWYgKCF1c2Vyc0lkc1ZhbCB8fCB1c2Vyc0lkc1ZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS50ZXh0KCdOb3RoaW5nIHRvIHNob3cuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1c2Vyc0lkcyA9IHVzZXJzSWRzVmFsLnNwbGl0KCcsJykubWFwKHYgPT4gdi50cmltKCkpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJzSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpID09PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHVzZXJJZCA9IHVzZXJzSWRzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF1c2VySWQgfHwgdXNlcklkID09ICcnKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmFwcGVuZChcclxuICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0nbS0zJyBzdHlsZT0nb3ZlcmZsb3c6YXV0bzsnPjxtZ3QtcGVyc29uIHVzZXItaWQ9J1wiICsgdXNlcnNJZHNbaV0gKyBcIicgZmV0Y2gtaW1hZ2U9J3RydWUnIHBlcnNvbi1jYXJkPSdob3Zlcicgdmlldz0ndHdvTGluZXMnPjwvbWd0LXBlcnNvbj48L2Rpdj5cIlxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7XHJcbiAgICBtb2RhbFBhbmVsVXNlcnMsXHJcbiAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLFxyXG4gICAgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAsXHJcbiAgICBtb2RhbFBhbmVsRGF0YWJyaWNrcyxcclxuICAgIG1vZGFsUGFuZWxEYXRhRmFjdG9yeVxyXG59IGZyb20gXCIuLi9tb2RhbC9pbmRleC5qc1wiO1xyXG5cclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBlbmdpbmVEZXRhaWxzUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRNZW1iZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0TWVtYmVyc1wiKTtcclxuXHJcbiAgICAgICAgbW9kYWxQYW5lbERlbGV0ZUVuZ2luZS5pbml0aWFsaXplKFwicGFuZWxEZWxldGVFbmdpbmVcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuaW5pdGlhbGl6ZShcInBhbmVsUmVzb3VyY2VHcm91cFwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsRGF0YWJyaWNrcy5pbml0aWFsaXplKFwicGFuZWxEYXRhYnJpY2tzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhRmFjdG9yeS5pbml0aWFsaXplKFwicGFuZWxEYXRhRmFjdG9yeVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9ICQoXCIjSWRcIik7XHJcblxyXG4gICAgICAgIGlmICgkKFwiI2NvbnNvbGVcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIgPSBuZXcgY29uc29sZTIoJChcIiNjb25zb2xlXCIpLCAkKCdkaXYuZG9ja2luZy1mb3JtJykpO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RhcnRlZCwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuY29ubmVjdGlvbi5pbnZva2UoJ1N1YnNjcmliZURlcGxveW1lbnRBc3luYycsIHRoaXMuaWQudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3lpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub2ZmKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu79leHBvcnQgY2xhc3MgZG90bWltdGFibGUge1xyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCB1cmwsIHVybENvdW50LCBwYWdlU2l6ZSkge1xyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsQ291bnQgPSB1cmxDb3VudCA/PyB0aGlzLnVybCArIFwiL2NvdW50XCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3Bpbm5lciA9ICQoJyNzcGlubmVyLScgKyBuYW1lKTtcclxuICAgICAgICB0aGlzLmJvZHkgPSAkKCcjdGJvZHktJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXMgPSAkKCcjcHJldmlvdXMtJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMubmV4dCA9ICQoJyNuZXh0LScgKyBuYW1lKTtcclxuICAgICAgICB0aGlzLnJlZnJlc2ggPSAkKCcjcmVmcmVzaC0nICsgbmFtZSk7XHJcblxyXG4gICAgICAgIC8vIGRpc2FibGUgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMucHJldmlvdXMucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgICAgICAvLyBnZXQgYSBwYWdlXHJcbiAgICAgICAgdGhpcy5wYWdlSW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuaXRlbXNDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYWdlU2l6ZSA9IHBhZ2VTaXplID8/IDI7XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaC5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByZXZpb3VzLmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXggLSAxO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0LmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXggKyAxO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkKCkge1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybCArICc/cGFnZUluZGV4PScgKyB0aGlzLnBhZ2VJbmRleCArICcmY291bnQ9JyArIHRoaXMucGFnZVNpemU7XHJcblxyXG4gICAgICAgIHRoaXMuc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgICAgLy9sZXQgZCA9IGF3YWl0ICQuZ2V0SlNPTih1cmwpO1xyXG5cclxuICAgICAgICB0aGlzLmJvZHkubG9hZCh1cmwsIChkLCBzdGF0dXMsIHhocikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBcImVycm9yXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZCB8fCBkLnRyaW0oKSA9PSAnJylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJSb3dzKCdObyBkYXRhJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZURpc2FibGVCdXR0b25zKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB0aGlzLnNwaW5uZXIuc2hvdygpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJSb3dzKCk7XHJcblxyXG4gICAgICAgICQuZ2V0SlNPTih0aGlzLnVybENvdW50LCBkYXRhID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0NvdW50ID0gZGF0YS5jb3VudDtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICAgICAgfSkuZmFpbCgoZXJyb3IpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBlcnJvclN0cmluZyA9IGVycm9yLnJlc3BvbnNlSlNPTiA/IChlcnJvci5yZXNwb25zZUpTT04uZXJyb3IgPz8gZXJyb3IucmVzcG9uc2VKU09OKSA6IGVycm9yLnJlc3BvbnNlVGV4dDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkRmlyc3RSb3dXYXJuaW5nKGVycm9yU3RyaW5nKTtcclxuICAgICAgICAgICAgdGhpcy5zcGlubmVyLmhpZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVEaXNhYmxlQnV0dG9ucygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEZpcnN0Um93V2FybmluZyh0ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5LmNoaWxkcmVuKCd0cicpLmFkZENsYXNzKCdiZy1kYW5nZXInKTtcclxuICAgICAgICB0aGlzLmJvZHkuY2hpbGRyZW4oJ3RyJykuY2hpbGRyZW4oJ3RkJykuYWRkQ2xhc3MoJ3RleHQtbGlnaHQnKS5hcHBlbmQodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJSb3dzKHRleHQpIHtcclxuICAgICAgICBsZXQgY29sdW1uc0NvdW50ID0gdGhpcy5ib2R5LnBhcmVudCgpLmZpbmQoJ3RoJykubGVuZ3RoO1xyXG4gICAgICAgIGlmICghY29sdW1uc0NvdW50KVxyXG4gICAgICAgICAgICBjb2x1bW5zQ291bnQgPSB0aGlzLmJvZHkucGFyZW50KCkuZmluZCgndHInKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFjb2x1bW5zQ291bnQpXHJcbiAgICAgICAgICAgIGNvbHVtbnNDb3VudCA9IDE7XHJcblxyXG4gICAgICAgIHRleHQgPSB0ZXh0ID8/ICcmbmJzcDsnO1xyXG5cclxuICAgICAgICB0aGlzLmJvZHkuaHRtbCgnPHRyPjx0ZCBjb2xzcGFuPScgKyBjb2x1bW5zQ291bnQgKyAnPicgKyB0ZXh0ICsgJzwvdGQ+PC90cj4nKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZW5hYmxlRGlzYWJsZUJ1dHRvbnMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhZ2VJbmRleCA8PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91cy5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgaWYgKCh0aGlzLnBhZ2VJbmRleCArIDEpICogdGhpcy5wYWdlU2l6ZSA+PSB0aGlzLml0ZW1zQ291bnQpXHJcbiAgICAgICAgICAgIHRoaXMubmV4dC5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMubmV4dC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vcm91dGVyLmpzXCI7XHJcbmltcG9ydCB7IGRvdG1pbXRhYmxlIH0gZnJvbSBcIi4uL2RvdG1pbXRhYmxlLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBhZG1pblBhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uVW5sb2FkKCkge1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgZGVsYXkgfSBmcm9tIFwiLi4vaGVscGVycy5qc1wiXHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCI7XHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5pbXBvcnQgeyBtb2RhbFBhbmVsVXNlcnMgfSBmcm9tIFwiLi4vbW9kYWwvbW9kYWxQYW5lbFVzZXJzLmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSAkKFwiI0VuZ2luZVZpZXdfSWRcIik7XHJcbiAgICAgICAgdGhpcy5jb25zb2xlMiA9IG5ldyBjb25zb2xlMigkKFwiI2NvbnNvbGVcIiksICQoJ2Rpdi5kb2NraW5nLWZvcm0nKSk7XHJcbiAgICAgICAgdGhpcy5sYXVuY2hCdXR0b24gPSAkKCcjbGF1bmNoJyk7XHJcbiAgICAgICAgdGhpcy5sYXVuY2hCdXR0b24ucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlkIHx8ICF0aGlzLmlkLnZhbCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhcIkNhbid0IGxhdW5jaCBkZXBsb3ltZW50LiBObyBlbmdpbmUgcmVxdWVzdCAuLi5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIGV2ZW50IGZyb20gc2lnbmFsciBhYm91dCBkZXBsb3ltZW50XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuY29ubmVjdGlvbi5pbnZva2UoJ1N1YnNjcmliZURlcGxveW1lbnRBc3luYycsIHRoaXMuaWQudmFsKCkpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBzdGFydGVkLlwiKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiUmVhZHkgdG8gZGVwbG95LlwiKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKVxyXG4gICAgICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZywgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgY29ubmVjdGluZy4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0b3BwZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0b3BwZWQuXCIpKTtcclxuXHJcbiAgICAgICAgLy8gSnVzdCBpbiBjYXNlIGl0J3Mgbm90IHN0YXJ0ZWQgKGJ1dCBzaG91bGQgYmUgZG9uZSBhbHJlYWR5IGZyb20gaG9tZVBhZ2UuanMpXHJcbiAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXVuY2hCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExhdW5jaCBhIHZhbGlkYXRpb24gYmVmb3JlXHJcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gJChcImZvcm1cIikudmFsaWQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaXNWYWxpZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubGF1bmNoSm9iQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBsYXVuY2hKb2JBc3luYygpIHtcclxuICAgICAgICB0aGlzLmNvbnNvbGUyLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkRlcGxveW1lbnQgc3RhcnRlZC5cIilcclxuICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaWQgfHwgIXRoaXMuaWQudmFsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKFwiQ2FuJ3QgbGF1bmNoIGRlcGxveW1lbnQuIE5vIGVuZ2luZSByZXF1ZXN0IC4uLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJTYXZpbmcgZGVwbG95bWVudCBwcm9wZXJ0aWVzLi4uXCIpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBGaXJzdCwgc2F2ZSB0aGUgZGVwbG95bWVudC5cclxuICAgICAgICAgICAgYXdhaXQgJC5wb3N0KCcnLCAkKCdmb3JtJykuc2VyaWFsaXplKCkpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBzYXZlIGVuZ2luZSBkZXRhaWxzYCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KGUucmVzcG9uc2VKU09OKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiV2FpdGluZyBmb3IgYW4gYWdlbnQgdG8gZW5xdWV1ZSB0aGUgZGVwbG95bWVudC4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHVybCBmb3IgdGhhdCBwYXJ0aWN1bGFyIGRlcGxveW1lbnRcclxuICAgICAgICAgICAgbGV0IHVybCA9IGAvYXBpL2VuZ2luZXMvJHt0aGlzLmlkLnZhbCgpfS9kZXBsb3lgO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoYDxiPkRlcGxveW1lbnQ8L2I+ICR7dGhpcy5pZC52YWwoKX0gY2FuIG5vdCBiZSBkZXBsb3llZC4uLmApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9ySnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QoZXJyb3JKc29uKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGRlcGxveW1lbnRzdGFydCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveW1lbnRzdGFydClcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGBVbmFibGUgdG8gZGVwbG95IGVuZ2luZWApO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdChlLnJlc3BvbnNlSlNPTik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3lpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHtcclxuICAgIG1vZGFsUGFuZWxVc2VycyxcclxuICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUsXHJcbiAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCxcclxuICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLFxyXG4gICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5XHJcbn0gZnJvbSBcIi4uL21vZGFsL2luZGV4LmpzXCI7XHJcblxyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGFkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLmluaXRpYWxpemUoXCJwYW5lbERlbGV0ZUVuZ2luZVwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cC5pbml0aWFsaXplKFwicGFuZWxSZXNvdXJjZUdyb3VwXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLmluaXRpYWxpemUoXCJwYW5lbERhdGFicmlja3NcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5LmluaXRpYWxpemUoXCJwYW5lbERhdGFGYWN0b3J5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gJChcIiNJZFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCQoXCIjY29uc29sZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMiA9IG5ldyBjb25zb2xlMigkKFwiI2NvbnNvbGVcIiksICQoJ2Rpdi5kb2NraW5nLWZvcm0nKSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3lpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub2ZmKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwi77u/XG5cbmV4cG9ydCBjbGFzcyBtZ3Rsb2FkZXIge1xuXHJcblxuICAgIHN0YXRpYyBzZXRNZ3RQcm92aWRlcigpIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgbWd0LlByb3h5UHJvdmlkZXIoXCIvYXBpL1Byb3h5XCIpO1xuICAgICAgICBwcm92aWRlci5sb2dpbiA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9BY2NvdW50L1NpZ25Jbj9yZWRpcmVjdFVyaT0nICsgd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIHByb3ZpZGVyLmxvZ291dCA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9NaWNyb3NvZnRJZGVudGl0eS9BY2NvdW50L1NpZ25PdXQnO1xuXG4gICAgICAgIG1ndC5Qcm92aWRlcnMuZ2xvYmFsUHJvdmlkZXIgPSBwcm92aWRlcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW50ZXJjZXB0TWd0TG9naW4oKSB7XG4gICAgICAgIHZhciBtZ3Rsb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZ3Rsb2dpbicpO1xuXG4gICAgICAgIC8vLy8gVGhlc2VzIGV2ZW50cyBhcmUgcmFpc2VkIHdoZW4gdXNlciBjbGljayBvbiBsb2dpbiBvdXIgbG9nb3V0IGJ1dHRvblxuICAgICAgICAvLy8vIFRoZXlyIGFyZSBub3QgcmFpc2VkIGF0IHRoZSBnb29kIHRpbWluZ1xuICAgICAgICAvLy8vIFNob3VsZCBiZSByZW5hbWVkICdsb2dpbkNsaWNrJyBhbmQgJ2xvZ291dENsaWNrJ1xuICAgICAgICAvL21ndGxvZ2luLmFkZEV2ZW50TGlzdGVuZXIoJ2xvZ2luQ29tcGxldGVkJywgKCkgPT4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ1c2VyZGV0YWlsc1wiKSk7XG4gICAgICAgIC8vbWd0bG9naW4uYWRkRXZlbnRMaXN0ZW5lcignbG9nb3V0Q29tcGxldGVkJywgKCkgPT4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ1c2VyZGV0YWlsc1wiKSk7XG5cbiAgICAgICAgLy8vLyBnZXQgbG9jYWwgc3RvcmFnZSBpdGVtIGlmIGFueVxuICAgICAgICAvL3ZhciB1c2VyRGV0YWlsc0Zyb21TdG9yYWdlU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJkZXRhaWxzJyk7XG5cbiAgICAgICAgLy9pZiAodXNlckRldGFpbHNGcm9tU3RvcmFnZVN0cmluZyAhPT0gbnVsbCAmJiBtZ3Rsb2dpbi51c2VyRGV0YWlscyA9PT0gbnVsbClcbiAgICAgICAgLy8gICAgbWd0bG9naW4udXNlckRldGFpbHMgPSBKU09OLnBhcnNlKHVzZXJEZXRhaWxzRnJvbVN0b3JhZ2VTdHJpbmcpO1xuXG4gICAgICAgIC8vLy8gTG9hZGluZyBjb21wbGV0ZWQgaXMgY29ycmVjdGx5IGZpcmVkIEFGVEVSIGNvbXBvbmVudCBpcyBsb2FkZWQgQU5EIHVzZXIgbG9nZ2VkIGluXG4gICAgICAgIC8vbWd0bG9naW4uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGluZ0NvbXBsZXRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gICAgaWYgKG1ndGxvZ2luLnVzZXJEZXRhaWxzICE9PSBudWxsKVxuICAgICAgICAvLyAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJkZXRhaWxzJywgSlNPTi5zdHJpbmdpZnkobWd0bG9naW4udXNlckRldGFpbHMpKTtcbiAgICAgICAgLy99KTtcblxuICAgIH1cbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tIFwiLi9oYW5kbGVycy5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgYXV0aCB7XHJcblxyXG5cclxuXHQvLyBzaW5nbGV0b25cclxuXHRzdGF0aWMgX2N1cnJlbnQ7XHJcblxyXG5cdC8qKiBAcmV0dXJucyB7YXV0aH0gKi9cclxuXHRzdGF0aWMgZ2V0IGN1cnJlbnQoKSB7XHJcblx0XHRpZiAoIWF1dGguX2N1cnJlbnQpXHJcblx0XHRcdGF1dGguX2N1cnJlbnQgPSBuZXcgYXV0aCgpO1xyXG5cclxuXHRcdHJldHVybiBhdXRoLl9jdXJyZW50O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIE9uQXV0aGVudGljYXRlZCA9IFwiT25BdXRoZW50aWNhdGVkXCJcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmhhbmRsZXJzID0gbmV3IGhhbmRsZXJzKCk7XHJcblxyXG5cdFx0LyoqIEB0eXBlIGJvb2xlYW4gKi9cclxuXHRcdHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZ2xvYmFsVXNlckF1dGhlbnRpY2F0ZWQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKCkge1xyXG5cclxuXHRcdCQoKCkgPT4ge1xyXG5cdFx0XHQvLyBpbnZva2UgYWxsIGhhbmRsZXJzIHRvIE9uQXV0aGVudGljYXRlZCB3aXRoIHRoZSBjb3JyZWN0IHZhbHVlXHJcblx0XHRcdHRoaXMuaGFuZGxlcnMuaW52b2tlKGF1dGguT25BdXRoZW50aWNhdGVkLCB0aGlzLmlzQXV0aGVudGljYXRlZCwgJ2Nvb2wnKVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRvbihtZXRob2ROYW1lLCBuZXdNZXRob2QpIHtcclxuXHRcdHRoaXMuaGFuZGxlcnMub24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKTtcclxuXHR9XHJcblxyXG5cdG9mZihtZXRob2ROYW1lLCBtZXRob2QpIHtcclxuXHRcdHRoaXMuaGFuZGxlcnMub2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCk7XHJcblx0fVxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4uL21vZGFsL21vZGFsUGFuZWwuanNcIjtcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4uL2F1dGguanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGhvbWVQYWdlIHtcclxuXHJcbiAgICAvLyBzaW5nbGV0b25cclxuICAgIHN0YXRpYyBfY3VycmVudDtcclxuXHJcbiAgICAvKiogQHJldHVybnMge2hvbWVQYWdlfSAqL1xyXG4gICAgc3RhdGljIGdldCBjdXJyZW50KCkge1xyXG4gICAgICAgIGlmICghaG9tZVBhZ2UuX2N1cnJlbnQpXHJcbiAgICAgICAgICAgIGhvbWVQYWdlLl9jdXJyZW50ID0gbmV3IGhvbWVQYWdlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBob21lUGFnZS5fY3VycmVudDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICAkKGFzeW5jICgpID0+IGF3YWl0IHRoaXMub25Mb2FkKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IGF3YWl0IGNvbnNvbGUubG9nKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZywgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG4gICAgICAgIC8vIHdoZW4gcmVjZWl2aW5nIGFuIG9yZGVyIHRvIHJlZnJlc2ggbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKCdyZWZyZXNoX25vdGlmaWNhdGlvbnMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbCB0byByZWZyZXNoX25vdGlmaWNhdGlvbnNcIik7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGF1dGguY3VycmVudC5pc0F1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwic2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGgtbGFyZ2VcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFib3V0ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlNvbWV0aGluZyBpbnRlcmVzdGluZyBsaWtlLi4uIEhleSwgdGhpcyBpcyBhIHBpZWNlIG9mIE9TUyBwcm9qZWN0LCBtYWRlIGJ5IFNlYmFzdGllbiBQZXJ0dXM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY29nc1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdCBFbmdpbmUgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPiAgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cIm10LTJcIiBkYXRhLXN0eWxlPVwiYnRuLW91dGxpbmUtZGFya1wiIGRhdGEtY29udGFpbmVyPVwiYm9keVwiIGRhdGEtbGl2ZS1zZWFyY2g9XCJ0cnVlXCIgdGl0bGU9XCJDaG9vc2UgZGVmYXVsdCBlbmdpbmVcIiBpZD1cImRlZmF1bHRFbmdpbmVTZWxlY3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5NdXN0YXJkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+S2V0Y2h1cDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlJlbGlzaDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgYCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjZGVmYXVsdEVuZ2luZVNlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIG5vdGlmaWNhdGlvbiBtb2RhbFxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbCA9IG5ldyBtb2RhbFBhbmVsKFwibm90aWZcIikuc20oKTtcclxuXHJcbiAgICAgICAgLy8gYXV0byBiaW5kIHdpdGggYXJyb3cgZnVuY3Rpb25cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwub25TaG93bihlID0+IHRoaXMuc2hvd25QYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgLy8gbWFudWFsIGJpbmRpbmcgZm9yIGZ1blxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5vblNob3codGhpcy5zaG93UGFuZWwuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbCA9IG5ldyBtb2RhbFBhbmVsKFwic2V0dGluZ3NcIikubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLm9uU2hvd24oZSA9PiB0aGlzLnNob3duU2V0dGluZ3NQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRTZXR0aW5nc1BhbmVsKGUpKTtcclxuXHJcblxyXG4gICAgICAgIGF1dGguY3VycmVudC5vbihhdXRoLk9uQXV0aGVudGljYXRlZCwgYXN5bmMgaXNBdXRoID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzQXV0aClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBkaXNtaXNzTm90aWZpY2F0aW9uc0FzeW5jKCkge1xyXG5cclxuICAgICAgICAvLyBsb2FkaW5nIG5vdGlmaWNhdGlvbnNcclxuICAgICAgICBsZXQgdXJsID0gXCIvYXBpL25vdGlmaWNhdGlvbnNcIjtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbWV0aG9kOiBcIkRFTEVURVwiIH0pO1xyXG5cclxuICAgICAgICB2YXIgZGVsZXRlZCA9IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFkZWxldGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoTm90aWZpY2F0aW9uc0FzeW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpIHtcclxuXHJcbiAgICAgICAgLy8gbG9hZGluZyBub3RpZmljYXRpb25zXHJcbiAgICAgICAgbGV0IHVybCA9IFwiL2FwaS9ub3RpZmljYXRpb25zXCI7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGxldCBiZWxsQ29udGVudCA9ICQoJyNub3RpZi1iZWxsLWNvbnRlbnQnKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm5vdGlmaWNhdGlvbnMgfHwgdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA8PSAwKSB7XHJcblxyXG4gICAgICAgICAgICBiZWxsQ29udGVudC5oaWRlKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtYmVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eS1tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5ObyBuZXcgbm90aWZpY2F0aW9ucywgeWV0Ljwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBiZWxsQ29udGVudC5zaG93KCk7XHJcbiAgICAgICAgICAgIGJlbGxDb250ZW50LnRleHQodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5vdGlmIG9mIHRoaXMubm90aWZpY2F0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBub3RpZlVybCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vdGlmLnVybClcclxuICAgICAgICAgICAgICAgICAgICBub3RpZlVybCA9IGA8YSBocmVmPVwiJHtub3RpZi51cmx9XCIgY2xhc3M9XCJtbC0yIGhpZGUtc21cIj48aSBjbGFzcz1cImZhcyBmYS1leHRlcm5hbC1saW5rLWFsdFwiPjwvaT48L2E+YDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmFwcGVuZChgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2stY2lyY2xlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtub3RpZi50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtub3RpZi5tZXNzYWdlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bm90aWZVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2ID5cclxuICAgICAgICAgICAgICAgICAgICA8L2RpdiA+IGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcbiAgICAgICAgdmFyIHR5cGUgPSBidXR0b24uZGF0YSgndHlwZScpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3duU2V0dGluZ3NQYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRTZXR0aW5nc1BhbmVsKGV2ZW50KSB7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuZGVsZXRlQnV0dG9uVGV4dChcIkRpc21pc3Mgbm90aWZpY2F0aW9uc1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCFhdXRoLmN1cnJlbnQuaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuYXBwZW5kKGBcclxuICAgICAgICAgICAgICAgICAgICA8IGRpdiBjbGFzcz0gXCJub3RpZi1lbXB0eVwiID5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhciBmYS1iZWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eS1tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlBsZWFzZSBsb2cgaW4gdG8gc2VlIG5vdGlmaWNhdGlvbnMgaGVyZS48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXYgPiBgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5kZWxldGVCdXR0b24oKS5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRpc21pc3NOb3RpZmljYXRpb25zQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBzZXR0aW5nc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu79leHBvcnQgZnVuY3Rpb24gc2V0RW5naW5lQm9vdHN0cmFwVGFibGUoJGVuZ2luZXNUYWJsZSwgdXJsLCBjaGVja2VkLCBvblBvc3RCb2R5LCBvbkNoZWNrUm93KSB7XHJcblxyXG5cclxuICAgIGxldCBvbkNoZWNrID0gY2hlY2tlZCA/IG9uQ2hlY2tSb3cgOiAoKSA9PiB7IH07XHJcbiAgICBsZXQgb25DbGljayA9IGNoZWNrZWQgPyAoKSA9PiB7IH06IG9uQ2hlY2tSb3c7XHJcblxyXG4gICAgbGV0IGNvbHVtbnMgPSBbXTtcclxuICAgIGlmIChjaGVja2VkKVxyXG4gICAgICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgICAgIGZpZWxkOiAnZW5naW5lSWQnLFxyXG4gICAgICAgICAgICByYWRpbzogdHJ1ZSxcclxuICAgICAgICB9KVxyXG5cclxuICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgZmllbGQ6ICdlbmdpbmVUeXBlSnNvbicsXHJcbiAgICAgICAgdGl0bGU6ICdUeXBlJyxcclxuICAgICAgICB3aWR0aDogJzgwJyxcclxuICAgICAgICBhbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgc2VhcmNoRm9ybWF0dGVyOiBmYWxzZSxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz0nc3ZnLTIyeDIyLWljb24nPjxkaXYgY2xhc3M9J3N2Zy1pY29uICR7dmFsdWUuZW5naW5lVHlwZUljb25TdHJpbmd9Jz48L2Rpdj48L2Rpdj5gO1xyXG4gICAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAgICBmaWVsZDogJ3N0YXR1c0pzb24nLFxyXG4gICAgICAgIHRpdGxlOiAnU3RhdHVzJyxcclxuICAgICAgICB3aWR0aDogJzgwJyxcclxuICAgICAgICBhbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgc2VhcmNoRm9ybWF0dGVyOiBmYWxzZSxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGkgY2xhc3M9XCIke3ZhbHVlLnN0YXR1c0ljb259XCIgdGl0bGU9JyR7dmFsdWUuc3RhdHVzU3RyaW5nfScgc3R5bGU9XCJjb2xvcjoke3ZhbHVlLnN0YXR1c0NvbG9yfTt3aWR0aDoyMHB4O1wiPjwvaT5gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCB7XHJcbiAgICAgICAgZmllbGQ6ICdlbmdpbmVOYW1lJyxcclxuICAgICAgICB0aXRsZTogJ05hbWUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCByb3cpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGA8c3Ryb25nPiR7dmFsdWV9PC9zdHJvbmc+YDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBzZWFyY2g6IGZhbHNlLFxyXG4gICAgICAgIHNob3dSZWZyZXNoOiBmYWxzZSxcclxuICAgICAgICBzaG93VG9nZ2xlOiBmYWxzZSxcclxuICAgICAgICBjaGVja2JveEhlYWRlcjogZmFsc2UsXHJcbiAgICAgICAgY2xpY2tUb1NlbGVjdDogdHJ1ZSxcclxuICAgICAgICBwYWdpbmF0aW9uOiBmYWxzZSxcclxuICAgICAgICByZXNpemFibGU6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZ1RlbXBsYXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAnPGkgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtZncgZmEtMnhcIj48L2k+JztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgb25Qb3N0Qm9keTogb25Qb3N0Qm9keSxcclxuICAgICAgICBvbkNoZWNrOiBvbkNoZWNrLFxyXG4gICAgICAgIG9uQ2xpY2tSb3c6IG9uQ2xpY2ssXHJcbiAgICAgICAgZm9ybWF0Tm9NYXRjaGVzOiAoKSA9PiB7IHJldHVybiBcIllvdSBkb24ndCBoYXZlIGFueSBydW5uaW5nIGVuZ2luZS4gUGxlYXNlIDxhIGhyZWY9Jy9FbmdpbmVzL0luZGV4Jz5jaGVjayB5b3VyIGVuZ2luZXMgc3RhdHVzLjwvYT4gXCI7IH1cclxuICAgIH0pO1xyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSB9IGZyb20gXCIuLi9ib290c3RyYXBUYWJsZXMvaW5kZXguanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlc1BhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIGdldCB0YWJsZVxyXG4gICAgICAgIHRoaXMuZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBlbmdpbmUgdGFibGVcclxuICAgICAgICB0aGlzLiRlbmdpbmVzVGFibGUgPSAkKFwiI2VuZ2luZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUodGhpcy4kZW5naW5lc1RhYmxlLCBcIi9kYXRhU291cmNlcy9pbmRleC9lbmdpbmVzXCIsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLm9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3cpID0+IHRoaXMub25DbGlja1Jvdyhyb3cpKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlID0gJChcIiNkYXRhU291cmNlc1RhYmxlXCIpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gJ1BsZWFzZSBzZWxlY3QgYSBydW5uaW5nIGVuZ2luZSB0byBzZWUgYWxsIGRhdGEgc291cmNlcyBhdmFpbGFibGUuJzsgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUub24oJ2NsaWNrLXJvdy5icy50YWJsZScsIChyb3csICRlbGVtZW50LCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvRGF0YVNvdXJjZXMvRWRpdC8ke3RoaXMuZW5naW5lLmlkfS8keyRlbGVtZW50Lm5hbWV9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblBvc3RCb2R5KGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsaWNrUm93KHJvdykge1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZSA9IHJvdztcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWREYXRhU291cmNlc0FzeW5jKHRoaXMuZW5naW5lKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgbG9hZERhdGFTb3VyY2VzQXN5bmMoZW5naW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnc2hvd0xvYWRpbmcnKTtcclxuICAgICAgICBsZXQgZGF0YV91cmwgPSBgL2RhdGFTb3VyY2VzL2luZGV4L2RhdGFTb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lLmlkfWA7XHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChkYXRhX3VybCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlcyA9IGF3YWl0IGRhdGFTb3VyY2VzUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZGF0YVNvdXJjZXMpXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCd1cGRhdGVGb3JtYXRUZXh0JywgJ2Zvcm1hdE5vTWF0Y2hlcycsXHJcbiAgICAgICAgICAgIGBObyBkYXRhIHNvdXJjZXMgZm9yIGVuZ2luZSA8c3Ryb25nPiR7ZW5naW5lLmVuZ2luZU5hbWV9PC9zdHJvbmc+LiA8YSBocmVmPScvZGF0YVNvdXJjZXMvbmV3Jz5DcmVhdGUgYSBuZXcgZGF0YSBzb3VyY2U8L2E+IGZvciB5b3VyIGVuZ2luZWApO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2xvYWQnLCB0aGlzLmRhdGFTb3VyY2VzKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdoaWRlTG9hZGluZycpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3Mgd2l6YXJkUGFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaHRtbEZpZWxkUHJlZml4LCBlbmdpbmVVcmwpIHtcclxuXHJcbiAgICAgICAgLy8gSHRtbEZpZWxkUHJlZml4IHByZWZpeCBpcyB0aGUgcHJlZGl4IGZvciByZW5kZXJpbmcgYXNwLm5ldCBjb3JlIGl0ZW1zXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBgJHtodG1sRmllbGRQcmVmaXh9X2A7XHJcblxyXG4gICAgICAgIC8vIHVybCBmb3IgbG9hZGluZyBlbmdpbmVzXHJcbiAgICAgICAgdGhpcy5lbmdpbmVVcmwgPSBlbmdpbmVVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGdldCBmb3JtXHJcbiAgICAgICAgdGhpcy4kZm9ybSA9ICQoXCJmb3JtXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgZW5naW5lIHRhYmxlXHJcbiAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBzcGlubmVyXHJcbiAgICAgICAgdGhpcy4kc3Bpbm5lciA9ICQoXCIjc3Bpbm5lclwiKVxyXG5cclxuICAgICAgICAvLyBnZXQgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuJG5leHRCdXR0b24gPSAkKFwiI25leHRCdXR0b25cIik7XHJcbiAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24gPSAkKFwiI3ByZXZpb3VzQnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuJHNhdmVCdXR0b24gPSAkKFwiI3NhdmVCdXR0b25cIik7XHJcblxyXG4gICAgICAgIC8vIGdldCB3aXphcmRcclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZCA9ICQoXCIjc21hcnRXaXphcmRcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBwcm9wZXJ0aWVzIHBhbmVsXHJcbiAgICAgICAgdGhpcy4kcHJvcGVydGllcyA9ICQoXCIjcHJvcGVydGllc1wiKTtcclxuXHJcbiAgICAgICAgLy8gaGlkZGVuIGZpZWxkc1xyXG4gICAgICAgIHRoaXMuJGVuZ2luZUlkRWxlbWVudCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fUVuZ2luZUlkYCk7XHJcbiAgICAgICAgdGhpcy4kaXNOZXcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1Jc05ld2ApO1xyXG4gICAgICAgIHRoaXMuJHN0ZXAgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1TdGVwYCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcCA9IHRoaXMuJHN0ZXAgPyB0aGlzLiRzdGVwLnZhbCgpIDogMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJHNwaW5uZXIpXHJcbiAgICAgICAgICAgIHRoaXMuJHNwaW5uZXIuaGlkZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmJvb3N0cmFwRW5naW5lc1RhYmxlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9vdHN0cmFwV2l6YXJkKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9vdHN0cmFwQnV0dG9ucygpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBib290c3RyYXBXaXphcmQoKSB7XHJcblxyXG4gICAgICAgIC8vIFN0ZXAgc2hvdyBldmVudFxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLm9uKFwic2hvd1N0ZXBcIiwgYXN5bmMgKGUsIGFuY2hvck9iamVjdCwgc3RlcE51bWJlciwgc3RlcERpcmVjdGlvbiwgc3RlcFBvc2l0aW9uKSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRzdGVwLnZhbChzdGVwTnVtYmVyKTtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJHNhdmVCdXR0b24uZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gXCJmaXJzdFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcImxhc3RcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzYXZlQnV0dG9uLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYm9vdHN0cmFwIHdpemFyZFxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc3RlcCxcclxuICAgICAgICAgICAgdGhlbWU6ICdkb3RzJywgLy8gdGhlbWUgZm9yIHRoZSB3aXphcmQsIHJlbGF0ZWQgY3NzIG5lZWQgdG8gaW5jbHVkZSBmb3Igb3RoZXIgdGhhbiBkZWZhdWx0IHRoZW1lXHJcbiAgICAgICAgICAgIGF1dG9BZGp1c3RIZWlnaHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRWZmZWN0IG9uIG5hdmlnYXRpb24sIG5vbmUvZmFkZS9zbGlkZS1ob3Jpem9udGFsL3NsaWRlLXZlcnRpY2FsL3NsaWRlLXN3aW5nXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJzIwMCcsIC8vIFRyYW5zaW9uIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnJyAvLyBUcmFuc2l0aW9uIGFuaW1hdGlvbiBlYXNpbmcuIE5vdCBzdXBwb3J0ZWQgd2l0aG91dCBhIGpRdWVyeSBlYXNpbmcgcGx1Z2luXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuYWJsZVVSTGhhc2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB0b29sYmFyU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJQb3NpdGlvbjogJ25vbmUnLCAvLyBub25lLCB0b3AsIGJvdHRvbSwgYm90aFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvblBvc2l0aW9uOiAncmlnaHQnLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXHJcbiAgICAgICAgICAgICAgICBzaG93TmV4dEJ1dHRvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBhIE5leHQgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBzaG93UHJldmlvdXNCdXR0b246IGZhbHNlLCAvLyBzaG93L2hpZGUgYSBQcmV2aW91cyBidXR0b25cclxuICAgICAgICAgICAgICAgIHRvb2xiYXJFeHRyYUJ1dHRvbnM6IFtdIC8vIEV4dHJhIGJ1dHRvbnMgdG8gc2hvdyBvbiB0b29sYmFyLCBhcnJheSBvZiBqUXVlcnkgaW5wdXQvYnV0dG9ucyBlbGVtZW50c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBrZXlib2FyZFNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBrZXlOYXZpZ2F0aW9uOiBmYWxzZSwgLy8gRW5hYmxlL0Rpc2FibGUga2V5Ym9hcmQgbmF2aWdhdGlvbihsZWZ0IGFuZCByaWdodCBrZXlzIGFyZSB1c2VkIGlmIGVuYWJsZWQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uQ2hlY2tSb3cocm93LCAkZWxlbWVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLiRlbmdpbmVJZEVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwocm93LmlkKTtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoIWRhdGE/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0QnV0dG9uLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudCAmJiB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gZGF0YS5maW5kSW5kZXgoZSA9PiBlLmlkID09PSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCBzZWxlY3RlZEluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgcmFkaW8gaW5wdXRzIGJ1dHRvbnMgdG8gYWRkIGEgdmFsaWRhdGlvbiBydWxlIG9uIHRoZW1cclxuICAgICAgICBsZXQgJGJ0U2VsZWN0SXRlbSA9ICQoJ2lucHV0W25hbWU9XCJidFNlbGVjdEl0ZW1cIl0nKTtcclxuXHJcbiAgICAgICAgJGJ0U2VsZWN0SXRlbS5ydWxlcyhcImFkZFwiLCB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwiWW91IHNob3VsZCBzZWxlY3QgYW4gZW5naW5lIGJlZm9yZSBnb2luZyBuZXh0IHN0ZXAuXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYm9vc3RyYXBFbmdpbmVzVGFibGUoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZW5naW5lc1RhYmxlIHx8ICF0aGlzLmVuZ2luZVVybClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsIHRoaXMuZW5naW5lVXJsLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5lbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3csICRlbGVtZW50KSA9PiB0aGlzLmVuZ2luZVRhYmxlT25DaGVja1Jvdyhyb3csICRlbGVtZW50KSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJvb3RzdHJhcEJ1dHRvbnMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRwcmV2aW91c0J1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwicHJldlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRuZXh0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRm9ybSgpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcIm5leHRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YWxpZGF0ZUZvcm0oKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZm9ybSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gdGhpcy4kZm9ybS52YWxpZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWlzVmFsaWQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbGlkYXRvciA9IHRoaXMuJGZvcm0udmFsaWRhdGUoKTtcclxuICAgICAgICB2YWxpZGF0b3IucmVzZXRGb3JtKCk7XHJcblxyXG4gICAgICAgIGxldCBzdW1tYXJ5ID0gdGhpcy4kZm9ybS5maW5kKFwiLnZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIik7XHJcblxyXG4gICAgICAgIGlmIChzdW1tYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gc3VtbWFyeS5maW5kKFwidWxcIik7XHJcbiAgICAgICAgICAgIGlmIChsaXN0KVxyXG4gICAgICAgICAgICAgICAgbGlzdC5lbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVTcWwge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUF6dXJlU3FsRGF0YWJhc2VgKTtcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9kYXRhU291cmNlcy9uZXcvcHJvcGVydGllcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkdnQ9QXp1cmVCbG9iRlNgKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZUNvc21vc0RiIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBsb2FkQXN5bmMoZW5naW5lSWQsIGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUNvc21vc0RiYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgd2l6YXJkUGFnZSB9IGZyb20gJy4uL3dpemFyZC9pbmRleC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZVNxbCB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlU3FsLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMi5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZUNvc21vc0RiIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVDb3Ntb3NEYi5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgZGF0YVNvdXJjZU5ldyBleHRlbmRzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCdEYXRhU291cmNlVmlldycsICcvZGF0YVNvdXJjZXMvbmV3L2VuZ2luZXMnKVxyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZVNxbCA9IG5ldyBkYXRhU291cmNlQXp1cmVTcWwoKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIgPSBuZXcgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMigpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIgPSBuZXcgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIoKTtcclxuICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSAnJztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBvbkxvYWQgbWV0aG9kXHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInN0ZXBDb250ZW50XCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKHN0ZXBOdW1iZXIgPT0gMikge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXI/LnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9IHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbmdpbmVJZD8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBzZWxlY3Rpb24gZnJvbSBkYXRhIHNvdXJjZXMgdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoYGlucHV0W25hbWU9XCJEYXRhU291cmNlVmlldy5EYXRhU291cmNlVHlwZVwiXTpjaGVja2VkYCkudmFsKClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9PT0gdHlwZS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0VHlwZVNlbGVjdGVkID0gdHlwZS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZXNxbGRhdGFiYXNlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlU3FsLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZXNxbGR3JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlU3FsLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZWJsb2JmcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2Nvc21vc2RiJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kc3Bpbm5lcj8uaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vYXN5bmMgdGVzdENvbm5lY3Rpb25Bc3luYyhldnQpIHtcclxuXHJcbiAgICAvLyAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnRleHQoXCJcIik7XHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnJlbW92ZUNsYXNzKCk7XHJcblxyXG4gICAgLy8gICAgdGhpcy5idG5UZXN0Q29ubmVjdGlvbi5kaXNhYmxlKCk7XHJcblxyXG4gICAgLy8gICAgLy8gdXJsIGZvciB0aGF0IHBhcnRpY3VsYXIgZGVwbG95bWVudFxyXG4gICAgLy8gICAgbGV0IHVybCA9IGAvYXBpL2RhdGFTb3VyY2VzL3NxbGNvbm5lY3Rpb24vdGVzdGA7XHJcblxyXG4gICAgLy8gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAvLyAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAvLyAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjb25uZWN0aW9uOiB0aGlzLmNvbm5lY3Rpb25TdHJpbmcudmFsKCkgfSksXHJcbiAgICAvLyAgICAgICAgaGVhZGVyczoge1xyXG4gICAgLy8gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgLy8gICAgICAgIH1cclxuICAgIC8vICAgIH0pO1xyXG5cclxuICAgIC8vICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAvLyAgICAgICAgdmFyIGVycm9ySnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgLy8gICAgICAgIGF3YWl0IHRoaXMubGJsVGVzdENvbm5lY3Rpb24udGV4dChlcnJvckpzb24uZXJyb3IpXHJcbiAgICAvLyAgICB9XHJcblxyXG4gICAgLy8gICAgdmFyIHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAvLyAgICBpZiAocmVzdWx0LnJlc3VsdCkge1xyXG4gICAgLy8gICAgICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24uYWRkQ2xhc3MoXCJ0ZXh0LXN1Y2Nlc3MgbWwtMlwiKTtcclxuICAgIC8vICAgICAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLmh0bWwoXCI8aSBjbGFzcz0nZmFzIGZhLWNoZWNrLWNpcmNsZSc+PC9pPiAgQ29ubmVjdGlvbiBzdWNjZXNzZnVsXCIpO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5hZGRDbGFzcyhcInRleHQtZGFuZ2VyIG1sLTJcIik7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5odG1sKFwiPGkgY2xhc3M9J2ZhcyBmYS1leGNsYW1hdGlvbi1jaXJjbGUnPjwvaT4gIENhbid0IGNvbm5lY3QgdG8gdGhlIHNvdXJjZSB1c2luZyB0aGlzIGNvbm5lY3Rpb24gc3RyaW5nXCIpO1xyXG4gICAgLy8gICAgfVxyXG5cclxuICAgIC8vICAgIHRoaXMuYnRuVGVzdENvbm5lY3Rpb24uZW5hYmxlKCk7XHJcbiAgICAvL31cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyB3aXphcmRQYWdlIH0gZnJvbSAnLi4vd2l6YXJkL2luZGV4LmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlU3FsIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVTcWwuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlRWRpdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gJChcIiNEYXRhU291cmNlVmlld19FbmdpbmVJZFwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24gPSAkKFwiI2RhdGFTb3VyY2VUZXN0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24ubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke3RoaXMuZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICBsZXQganNvbk9iamVjdFN0cmluZyA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfSnNvblN0cmluZ1wiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKGpzb25PYmplY3RTdHJpbmcgJiYganNvbk9iamVjdFN0cmluZy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvID0gSlNPTi5wYXJzZShqc29uT2JqZWN0U3RyaW5nKTtcclxuICAgICAgICAgICAgbGV0IGpzb25TdHJpbmcgPSBQcmlzbS5oaWdobGlnaHQoSlNPTi5zdHJpbmdpZnkobywgbnVsbCwgMiksIFByaXNtLmxhbmd1YWdlcy5qc29uLCAnanNvbicpO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzb3VyY2VDb2RlKVxyXG4gICAgICAgICAgICAgICAgJHNvdXJjZUNvZGUuaHRtbChqc29uU3RyaW5nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Qb3N0Qm9keShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsaWNrUm93KHJvdykge1xyXG4gICAgICAgIHRoaXMuZW5naW5lID0gcm93O1xyXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZEVudGl0aWVzQXN5bmModGhpcy5lbmdpbmUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIGdldCB0YWJsZVxyXG4gICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuJGVuZ2luZXNUYWJsZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsICcvZW50aXRpZXMvaW5kZXgvZW5naW5lcycsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLm9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3cpID0+IHRoaXMub25DbGlja1Jvdyhyb3cpKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZSA9ICQoXCIjZW50aXRpZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gJ1BsZWFzZSBzZWxlY3QgYSBydW5uaW5nIGVuZ2luZSB0byBzZWUgYWxsIHRoZSBlbnRpdGllcy4nOyB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUub24oJ2NsaWNrLXJvdy5icy50YWJsZScsIChyb3csICRlbGVtZW50LCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvRW50aXRpZXMvRWRpdC8ke3RoaXMuZW5naW5lLmlkfS8keyRlbGVtZW50Lm5hbWV9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiBcclxuXHJcblxyXG4gICAgYXN5bmMgbG9hZEVudGl0aWVzQXN5bmMoZW5naW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3Nob3dMb2FkaW5nJyk7XHJcbiAgICAgICAgbGV0IGRhdGFfdXJsID0gYC9lbnRpdGllcy9pbmRleC9lbnRpdGllcz9lbmdpbmVJZD0ke2VuZ2luZS5pZH1gO1xyXG4gICAgICAgIGxldCBlbnRpdGllc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goZGF0YV91cmwpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBhd2FpdCBlbnRpdGllc1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmVudGl0aWVzKVxyXG4gICAgICAgICAgICB0aGlzLmVudGl0aWVzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3VwZGF0ZUZvcm1hdFRleHQnLCAnZm9ybWF0Tm9NYXRjaGVzJyxcclxuICAgICAgICAgICAgYE5vIGVudGl0aWVzIGZvciBlbmdpbmUgPHN0cm9uZz4ke2VuZ2luZS5lbmdpbmVOYW1lfTwvc3Ryb25nPi4gPGEgaHJlZj0nL2VudGl0aWVzL25ldyc+Q3JlYXRlIGEgbmV3IGVudGl0eTwvYT4gZm9yIHlvdXIgZW5naW5lYCk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2xvYWQnLCB0aGlzLmVudGl0aWVzKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnaGlkZUxvYWRpbmcnKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIG9uVW5Mb2FkKCkge1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzQXp1cmVTcWwge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHQvKipcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZ2luZUlkXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRBc3luYyhodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQsIGVuZ2luZUlkKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PUF6dXJlU3FsVGFibGUmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCBlcnJvcnMgbGFiZWxzXHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzID0gJChcIiNsYWJlbEVycm9yRGF0YVNvdXJjZXNcIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcyA9ICQoXCIjbGFiZWxFcnJvclRhYmxlc1wiKTtcclxuXHJcbiAgICAgICAgLy8gb25jZSBsb2FkZWQsIGdldCB0aGUgc2VsZWN0b3JzXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZWApO1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZXNJdGVtc1N0cmluZ2ApO1xyXG4gICAgICAgIC8vIG9uIGRhdGEgc291cmNlcyBjaGFuZ2VzLCByZWZyZXNoIHRoZSB0YWJsZXNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5jaGFuZ2UoYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLnJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCkgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlTmFtZWApO1xyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZyA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlc0l0ZW1zU3RyaW5nYCk7XHJcbiAgICAgICAgLy8gb24gdGFibGUgY2hhbmdlLCBzZXQgdGhlIGNvcnJlY3QgYXR0cmlidXRlcyBmb3IgdGhlIHByZXZpZXcgYnV0dG9uXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmNoYW5nZSgoKSA9PiB7IHRoaXMuc2V0UHJldmlld0RhdGFBdHRyaWJ1dGVzKGVuZ2luZUlkKSB9KTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCksIDEwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hEYXRhU291cmNlc0FzeW5jKGVuZ2luZUlkKSB7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZGlzYWJsZVBpY2tlcihcIkxvYWRpbmcgRGF0YSBTb3VyY2VzIC4uLlwiKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yVGFibGVzLmVtcHR5KCk7XHJcblxyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXNVcmwgPSBgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZVNxbERhdGFiYXNlYDtcclxuICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGRhdGFTb3VyY2VzVXJsKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGF3YWl0IHIuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoci5zdGF0dXMgIT0gNDAwKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzID0gZGF0YVNvdXJjZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YVNvdXJjZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLCB0ZXh0OiBpdGVtIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiTm8gRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoZGF0YVNvdXJjZXMuam9pbigpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YVNvdXJjZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJsb2FkaW5nIHRhYmxlcyAuLi5cIik7XHJcblxyXG4gICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgbGV0IHRhYmxlcyA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgdGFibGVzVXJsID0gYC9hcGkvQXp1cmVTcWxEYXRhYmFzZS8ke2VuZ2luZUlkfS8ke2RhdGFTb3VyY2VTZWxlY3RlZH0vdGFibGVzYDtcclxuICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKHRhYmxlc1VybCk7XHJcblxyXG4gICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy50ZXh0KHRleHQuZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyLnN0YXR1cyAhPSA0MDApIHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlcyA9IHRhYmxlc0pzb24ubWFwKGl0ZW0gPT4gYCR7aXRlbS5zY2hlbWFOYW1lfS4ke2l0ZW0udGFibGVOYW1lfWApO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKHRhYmxlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLCB0ZXh0OiBpdGVtIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGFibGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBUYWJsZXMuLi5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0U3RyaW5nLnZhbCh0YWJsZXMuam9pbigpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIHRhYmxlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgIGlmICh0YWJsZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICB0aGlzLnNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlU2VsZWN0ZWQ/Lmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdGFibGVTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YWJsZVNlbGVjdGVkPy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIHRhYmxlVGFiID0gdGFibGVTZWxlY3RlZC5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgdmFyIHNjaGVtYU5hbWUgPSB0YWJsZVRhYlswXTtcclxuICAgICAgICB2YXIgdGFibGVOYW1lID0gdGFibGVUYWJbMV07XHJcblxyXG4gICAgICAgIC8vIGJlZm9yZSByZWZyZXNoaW5nIGNvbHVtbnMsIGFkZCBkYXRhIHRvIHByZXZpZXcgYnV0dG9uc1xyXG4gICAgICAgIGxldCAkcHJldmlld0VudGl0eUJ1dHRvbiA9ICQoXCIjcHJldmlld0VudGl0eUJ1dHRvblwiKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZW5naW5lLWlkXCIsIGVuZ2luZUlkKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZGF0YS1zb3VyY2UtbmFtZVwiLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJzY2hlbWEtbmFtZVwiLCBzY2hlbWFOYW1lKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwidGFibGUtbmFtZVwiLCB0YWJsZU5hbWUpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJ0aXRsZVwiLCBgVGFibGUgcHJldmlldyBbJHtzY2hlbWFOYW1lfV0uWyR7dGFibGVOYW1lfV1gKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzRGVsaW1pdGVkVGV4dCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtKUXVlcnk8SFRNTEVsZW1lbnQ+fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5naW5lSWRcclxuICAgICAqL1xyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCwgZW5naW5lSWQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2VudGl0aWVzL25ldy9lbnRpdGllcz9kdnQ9RGVsaW1pdGVkVGV4dCZlbmdpbmVJZD0ke2VuZ2luZUlkfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIGFsbCBzZWxlY3QgcGlja2VyIGludG8gc2VsZWN0cGlja2VyXHJcbiAgICAgICAgJCgnc2VsZWN0Jykuc2VsZWN0cGlja2VyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcyA9ICQoXCIjbGFiZWxFcnJvckRhdGFTb3VyY2VzXCIpO1xyXG5cclxuICAgICAgICAvLyBvbmNlIGxvYWRlZCwgZ2V0IHRoZSBzZWxlY3RvcnNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0l0ZW1zU3RyaW5nYCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJMb2FkaW5nIERhdGEgU291cmNlcyAuLi5cIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLmVtcHR5KCk7XHJcblxyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXNVcmwgPSBgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZVNxbERhdGFiYXNlYDtcclxuICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGRhdGFTb3VyY2VzVXJsKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGF3YWl0IHIuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoci5zdGF0dXMgIT0gNDAwKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzID0gZGF0YVNvdXJjZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YVNvdXJjZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLCB0ZXh0OiBpdGVtIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiTm8gRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoZGF0YVNvdXJjZXMuam9pbigpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbFByZXZpZXcgfSBmcm9tIFwiLi4vbW9kYWwvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgZW50aXRpZXNBenVyZVNxbCB9IGZyb20gXCIuL2VudGl0aWVzQXp1cmVTcWwuanNcIjtcclxuaW1wb3J0IHsgZW50aXRpZXNEZWxpbWl0ZWRUZXh0IH0gZnJvbSBcIi4vZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmpzXCI7XHJcbmltcG9ydCB7IHdpemFyZFBhZ2UgfSBmcm9tICcuLi93aXphcmQvaW5kZXguanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzTmV3UGFnZSBleHRlbmRzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCdFbnRpdHlWaWV3JywgJy9lbnRpdGllcy9uZXcvZW5naW5lcycpO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzQXp1cmVTcWwgPSBuZXcgZW50aXRpZXNBenVyZVNxbCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXNEZWxpbWl0ZWRUZXh0ID0gbmV3IGVudGl0aWVzRGVsaW1pdGVkVGV4dCgpO1xyXG4gICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9ICcnO1xyXG59XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBvbkxvYWQgbWV0aG9kXHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcblxyXG4gICAgICAgIC8vIGluaXQgcHJldmlldyBwYW5lbFxyXG4gICAgICAgIG1vZGFsUGFuZWxQcmV2aWV3LmluaXRpYWxpemUoXCJwYW5lbFByZXZpZXdcIik7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBhbGwgc2VsZWN0IHBpY2tlciBpbnRvIHNlbGVjdHBpY2tlclxyXG4gICAgICAgICQoJ3NlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInN0ZXBDb250ZW50XCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09IDIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9IHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbmdpbmVJZD8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoYGlucHV0W25hbWU9XCJFbnRpdHlWaWV3LkVudGl0eVR5cGVcIl06Y2hlY2tlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0VHlwZVNlbGVjdGVkID09PSB0eXBlLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSB0eXBlLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSAnQXp1cmVTcWxUYWJsZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVudGl0aWVzQXp1cmVTcWwubG9hZEFzeW5jKHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzLCBlbmdpbmVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSAnRGVsaW1pdGVkVGV4dCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVudGl0aWVzRGVsaW1pdGVkVGV4dC5sb2FkQXN5bmModGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMsIGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5sZXQganF1ZXJ5RXh0ZW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBleHRlbmQgcGlja2VyXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgZGlzYWJsZVBpY2tlcjogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICB0aGlzLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0cihcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBtc2cpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBlbmFibGVQaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIGV4dGVuZCBlbmFibGUgZGlzYWJsZSBvZiBidXR0b25zIGFuZCBhIGhyZWZcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBlbmFibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgLy8gZXh0ZW5kIGxvYWQgYXN5bmNcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBsb2FkQXN5bmM6IGZ1bmN0aW9uIChkYXRhX3VybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKGRhdGFfdXJsLCAocmVzcG9uc2UsIHN0YXR1cywgeGhyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBcImVycm9yXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIHRlc3RBc3luYzogYXN5bmMgZnVuY3Rpb24gKHVybCkge1xyXG5cclxuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgYnV0dG9uIHdoaWNoIGNsaWNrZWQgIVxyXG4gICAgICAgICAgICBsZXQgJGJ0biA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkLWZsZXggYWxpZ24taXRlbXMtYmFzZWxpbmUgdGV4dC1ub3dyYXAnKS5hZGRDbGFzcygnZC1mbGV4IGFsaWduLWl0ZW1zLWJhc2VsaW5lIHRleHQtbm93cmFwJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnRuSWQgPSAkYnRuLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgICAgIGxldCBzcGlubmVySWQgPSBgJHtidG5JZH1TcGlubmVyYDtcclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2VJZCA9IGAke2J0bklkfU1lc3NhZ2VgO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRzcGlubmVyU3BhbiA9ICQoYCMke3NwaW5uZXJJZH1gKTtcclxuICAgICAgICAgICAgbGV0ICRtZXNzYWdlU3BhbiA9ICQoYCMke21lc3NhZ2VJZH1gKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJHNwaW5uZXJTcGFuLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICRidG4uYWZ0ZXIoYDxzcGFuIGlkPSR7c3Bpbm5lcklkfSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIiBjbGFzcz1cIm1sLTJcIj48aSBjbGFzcz1cImZhcyBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+PC9zcGFuPmApO1xyXG5cclxuICAgICAgICAgICAgJHNwaW5uZXJTcGFuID0gJChgIyR7c3Bpbm5lcklkfWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkbWVzc2FnZVNwYW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgJHNwaW5uZXJTcGFuLmFmdGVyKGA8c3BhbiBpZD0ke21lc3NhZ2VJZH0gc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCIgY2xhc3M9XCJtbC0yXCI+PC9zcGFuPmApO1xyXG5cclxuICAgICAgICAgICAgJG1lc3NhZ2VTcGFuID0gJChgIyR7bWVzc2FnZUlkfWApO1xyXG5cclxuICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmhpZGUoKTtcclxuICAgICAgICAgICAgJHNwaW5uZXJTcGFuLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gYXdhaXQgJGJ0bi5wb3N0QXN5bmModXJsLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAkc3Bpbm5lclNwYW4uaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuZXJyb3JzIHx8IHIgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyICYmIHIuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gT2JqZWN0LnZhbHVlcyhyLmVycm9ycykuZmxhdE1hcChlID0+IGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBbXCJDYW4ndCBjb25uZWN0XCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gYDxpIGNsYXNzPVwiZmFzIGZhLWV4Y2xhbWF0aW9uXCI+PC9pPiAke2Vycm9yc1swXX1gO1xyXG4gICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uYWRkQ2xhc3MoXCJ0ZXh0LWRhbmdlclwiKS5yZW1vdmVDbGFzcyhcInRleHQtc3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPiBjb25uZWN0aW9uIHN1Y2Nlc3NmdWwnO1xyXG4gICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uYWRkQ2xhc3MoXCJ0ZXh0LXN1Y2Nlc3NcIikucmVtb3ZlQ2xhc3MoXCJ0ZXh0LWRhbmdlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkbWVzc2FnZVNwYW4uc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBwb3N0QXN5bmM6IGFzeW5jIGZ1bmN0aW9uICh1cmwsIGNoZWNrSXNWYWxpZCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkKFwiZm9ybVwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGVja0lzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIExhdW5jaCBhIHZhbGlkYXRpb24gYmVmb3JlXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9ICQoXCJmb3JtXCIpLnZhbGlkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGZvcm1WYWx1ZXMgPSAkKCdmb3JtJykuc2VyaWFsaXplQXJyYXkoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICAkLmVhY2goZm9ybVZhbHVlcywgZnVuY3Rpb24gKGksIHYpIHtcclxuICAgICAgICAgICAgICAgIGZvcm1kYXRhLmFwcGVuZCh2Lm5hbWUsIHYudmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keTogZm9ybWRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDAgfHwgcmVzcG9uc2VKc29uID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tJc1ZhbGlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gJChkb2N1bWVudCkuZmluZChcIltkYXRhLXZhbG1zZy1zdW1tYXJ5PXRydWVdXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGNvbnRhaW5lci5maW5kKFwidWxcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VKc29uICYmIHJlc3BvbnNlSnNvbi5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IE9iamVjdC52YWx1ZXMocmVzcG9uc2VKc29uLmVycm9ycykuZmxhdE1hcChlID0+IGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gW1wiQ2FuJ3QgY29ubmVjdFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QgJiYgbGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhcInZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIikucmVtb3ZlQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktdmFsaWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVycm9ycywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCI8bGkgLz5cIikuaHRtbCh0aGlzKS5hcHBlbmRUbyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZUpzb247XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckV4Y2VwdGlvbjogW2VdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuXHJcbi8vYXN5bmMgcG9zdEFzeW5jKCkge1xyXG4vLyAgICAvLyBGaXJzdCwgc2F2ZSB0aGUgZGVwbG95bWVudC5cclxuXHJcbi8vICAgIGxldCB0b2tlbiA9ICQoJ2lucHV0W25hbWU9XCJfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlblwiXScpLnZhbCgpO1xyXG5cclxuLy8gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJycsIHtcclxuLy8gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4vLyAgICAgICAgYm9keTogYGRhdGFTb3VyY2VWaWV3LkVuZ2luZUlkPSR7dGhpcy5kYXRhU291cmNlVmlldy5lbmdpbmVJZH1gICtcclxuLy8gICAgICAgICAgICBgJmRhdGFTb3VyY2VWaWV3LkRhdGFTb3VyY2VUeXBlPSR7dGhpcy5kYXRhU291cmNlVmlldy5kYXRhU291cmNlVHlwZX1gICtcclxuLy8gICAgICAgICAgICBgJmRhdGFTb3VyY2VWaWV3LkNvbm5lY3Rpb25TdHJpbmc9JHt0aGlzLmRhdGFTb3VyY2VWaWV3LmNvbm5lY3Rpb25TdHJpbmd9YCArXHJcbi8vICAgICAgICAgICAgYCZfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlbj0ke3Rva2VufWAsXHJcbi8vICAgICAgICBoZWFkZXJzOiB7XHJcbi8vICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9dXRmLThcIlxyXG4vLyAgICAgICAgfVxyXG4vLyAgICB9KTtcclxuXHJcbi8vfVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGpxdWVyeUV4dGVuZHMpKCk7Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4vcm91dGVyLmpzXCI7XHJcbmltcG9ydCB7IGRhc2hib2FyZFBhZ2UgfSBmcm9tIFwiLi9kYXNoYm9hcmQvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgZW5naW5lc1BhZ2UsIGVuZ2luZURldGFpbHNQYWdlIH0gZnJvbSBcIi4vZW5naW5lcy9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBhZG1pblBhZ2UsIGFkbWluRGVwbG95bWVudEVuZ2luZVBhZ2UsIGFkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlIH0gZnJvbSBcIi4vYWRtaW4vaW5kZXguanNcIjtcclxuaW1wb3J0IHsgbWd0bG9hZGVyIH0gZnJvbSBcIi4vbWd0LmpzXCI7XHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuL25vdGlmaWNhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBob21lUGFnZSB9IGZyb20gXCIuL2hvbWUvaG9tZVBhZ2UuanNcIjtcclxuaW1wb3J0IHsgc2V0dGluZ3NQYWdlIH0gZnJvbSBcIi4vc2V0dGluZ3Mvc2V0dGluZ3NQYWdlLmpzXCI7XHJcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCJcclxuaW1wb3J0IHsgZG90bWltdGFibGUgfSBmcm9tIFwiLi9kb3RtaW10YWJsZVwiXHJcbmltcG9ydCB7IHBlcnNvbkZvcm1hdHRlcnMgfSBmcm9tICcuL2Zvcm1hdHRlcnMvaW5kZXguanMnXHJcbmltcG9ydCB7IGRhdGFTb3VyY2VOZXcsIGRhdGFTb3VyY2VzUGFnZSwgZGF0YVNvdXJjZUVkaXQgfSBmcm9tICcuL2RhdGFTb3VyY2VzL2luZGV4LmpzJ1xyXG5pbXBvcnQgeyBlbnRpdGllc1BhZ2UsIGVudGl0aWVzTmV3UGFnZSB9IGZyb20gJy4vZW50aXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBkIGZyb20gJy4vZXh0ZW5zaW9ucy5qcyc7XHJcblxyXG5kb3RtaW10YWJsZS5pbml0aWFsaXplKCk7XHJcblxyXG4vLyBJbml0aWFsaXplIGhvbWUgcGFnZSB0byByZWdpc3RlciBub3RpZmljYXRpb25zXHJcbmhvbWVQYWdlLmN1cnJlbnQuaW5pdGlhbGl6ZSgpO1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBhdXRoIGhlbHBlclxyXG5hdXRoLmN1cnJlbnQuaW5pdGlhbGl6ZSgpO1xyXG5cclxuXHJcbm1ndGxvYWRlci5zZXRNZ3RQcm92aWRlcigpO1xyXG5tZ3Rsb2FkZXIuaW50ZXJjZXB0TWd0TG9naW4oKTtcclxuXHJcbnJvdXRlci5yZWdpc3RlcignL0Rhc2hib2FyZCcsIGRhc2hib2FyZFBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXNoYm9hcmQvSW5kZXgnLCBkYXNoYm9hcmRQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcycsIGVuZ2luZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcy9JbmRleCcsIGVuZ2luZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcy9EZXRhaWxzJywgZW5naW5lRGV0YWlsc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbi9JbmRleCcsIGFkbWluUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluJywgYWRtaW5QYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvU2V0dGluZ3MvSW5kZXgnLCBzZXR0aW5nc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9TZXR0aW5ncycsIHNldHRpbmdzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluL0RldGFpbHMnLCBhZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluL0RlcGxveScsIGFkbWluRGVwbG95bWVudEVuZ2luZVBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcycsIGRhdGFTb3VyY2VzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0RhdGFTb3VyY2VzL05ldycsIGRhdGFTb3VyY2VOZXcpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcy9FZGl0JywgZGF0YVNvdXJjZUVkaXQpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbnRpdGllcycsIGVudGl0aWVzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VudGl0aWVzL05ldycsIGVudGl0aWVzTmV3UGFnZSk7XHJcbiJdLCJuYW1lcyI6WyJyb3V0ZXIiXSwibWFwcGluZ3MiOiJBQUFDO0FBQ0Q7QUFDTyxNQUFNLE1BQU0sQ0FBQztBQUNwQjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzdCLFFBQVEsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDaEQ7QUFDQSxRQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEY7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