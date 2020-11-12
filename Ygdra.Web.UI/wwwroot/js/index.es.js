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

    get loadMethod() {
        return this._loadMethod;
    }
    set loadMethod(x) {
        this._loadMethod = x;
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

        this.loadMethod = 'GET';

        if (this.$engineIdElement.val())
            this.loadMethod = 'POST';

        if (this.$spinner)
            this.$spinner.hide();

        this.boostrapEnginesTable();

        this.bootstrapWizard();

        this.bootstrapButtons();
    }


    bootstrapWizard() {

        // Step show event
        this.$smartWizard.on("showStep", async (e, anchorObject, stepNumber, stepDirection, stepPosition) => {

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

        let step = 0;

        if (this.loadMethod == 'POST')
            step = 2;

        // bootstrap wizard
        this.$smartWizard.smartWizard({
            selected: step,
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

        // On PostBack, select the correct engine
        if (this.loadMethod === 'POST')
            this.$enginesTable.bootstrapTable('check', data.findIndex(e => e.id === this.$engineIdElement.val()));


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


    async loadAsync(engineId, htmlFieldPrefix, element, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;


        if (loadMethod !== 'POST') {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureSqlDatabase`);
        }

        //if (loadMethod !== 'POST') {
        //}
        
    }

}

class dataSourceAzureDataLakeV2 {


    async loadAsync(engineId, htmlFieldPrefix, element, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);
        }

    }

}

class dataSourceAzureCosmosDb {


    async loadAsync(engineId, htmlFieldPrefix, element, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=CosmosDb`);
        }
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

                        if (!engineId?.length)
                            return;
                        // get selection from data sources type
                        let type = $(`input[name="DataSourceView.DataSourceType"]:checked`).val();

                        if (!type)
                            return;

                        if (this.lastTypeSelected === type)
                            return;

                        this.lastTypeSelected = type;

                        if (type.toString().toLowerCase() == 'azuresqldatabase')
                            await this.dataSourceAzureSql.loadAsync(engineId, this.htmlFieldPrefix, this.$properties, this.loadMethod);

                        if (type.toString().toLowerCase() == 'azuresqldw')
                            await this.dataSourceAzureSql.loadAsync(engineId, this.htmlFieldPrefix, this.$properties, this.loadMethod);

                        if (type.toString().toLowerCase() == 'azureblobfs')
                            await this.dataSourceAzureDataLakeV2.loadAsync(engineId, this.htmlFieldPrefix, this.$properties, this.loadMethod);

                        if (type.toString().toLowerCase() == 'cosmosdb')
                            await this.dataSourceAzureCosmosDb.loadAsync(engineId, this.htmlFieldPrefix, this.$properties, this.loadMethod);

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

	/**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     * @param {string} loadMethod
     */
    async loadAsync(htmlFieldPrefix, element, engineId, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
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

        if (loadMethod !== 'POST') {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
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

	/**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     * @param {string} loadMethod
     */
    async loadAsync(htmlFieldPrefix, element, engineId, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
            await element.loadAsync(`/entities/new/entities?dvt=DelimitedText&engineId=${engineId}`);
        }

        // transform all select picker into selectpicker
        $('select').selectpicker();

        this.$labelErrorDataSources = $("#labelErrorDataSources");

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);

        if (loadMethod !== 'POST') {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
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

                        if (!engineId?.length)
                            return;

                        let type = $(`input[name="EntityView.EntityType"]:checked`).val();

                        if (!type)
                            return;

                        if (this.lastTypeSelected === type)
                            return;

                        this.lastTypeSelected = type;

                        if (type == 'AzureSqlTable')
                            await this.entitiesAzureSql.loadAsync(this.htmlFieldPrefix, this.$properties, engineId, this.loadMethod);

                        if (type == 'DelimitedText')
                            await this.entitiesDelimitedText.loadAsync(this.htmlFieldPrefix, this.$properties, engineId, this.loadMethod);

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIkNsaWVudFNyYy9yb3V0ZXIuanMiLCJDbGllbnRTcmMvZGFzaGJvYXJkL2Rhc2hib2FyZFBhZ2UuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVzUGFnZS5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsLmpzIiwiQ2xpZW50U3JjL2NvbnNvbGUyLmpzIiwiQ2xpZW50U3JjL2hlbHBlcnMuanMiLCJDbGllbnRTcmMvaGFuZGxlcnMuanMiLCJDbGllbnRTcmMvbm90aWZpY2F0aW9uLmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxEZWxldGVFbmdpbmUuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFicmlja3MuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFGYWN0b3J5LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxQcmV2aWV3LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxVc2Vycy5qcyIsIkNsaWVudFNyYy9lbmdpbmVzL2VuZ2luZURldGFpbHNQYWdlLmpzIiwiQ2xpZW50U3JjL2RvdG1pbXRhYmxlLmpzIiwiQ2xpZW50U3JjL2FkbWluL2FkbWluUGFnZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlLmpzIiwiQ2xpZW50U3JjL2FkbWluL2FkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlLmpzIiwiQ2xpZW50U3JjL21ndC5qcyIsIkNsaWVudFNyYy9hdXRoLmpzIiwiQ2xpZW50U3JjL2hvbWUvaG9tZVBhZ2UuanMiLCJDbGllbnRTcmMvc2V0dGluZ3Mvc2V0dGluZ3NQYWdlLmpzIiwiQ2xpZW50U3JjL2Jvb3RzdHJhcFRhYmxlcy9lbmdpbmVCb290c3RyYXBUYWJsZS5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlc1BhZ2UuanMiLCJDbGllbnRTcmMvd2l6YXJkL3dpemFyZFBhZ2UuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUF6dXJlU3FsLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZU5ldy5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlRWRpdC5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc1BhZ2UuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNBenVyZVNxbC5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc0RlbGltaXRlZFRleHQuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNOZXdQYWdlLmpzIiwiQ2xpZW50U3JjL2V4dGVuc2lvbnMuanMiLCJDbGllbnRTcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gQHRzLWNoZWNrIFxyXG5cclxuZXhwb3J0IGNsYXNzIHJvdXRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAocHNlKSA9PiB0aGlzLl9vbkxvY2F0aW9uQ2hhbmdlKHBzZSkpO1xyXG5cclxuICAgICAgICB0aGlzLl9pbml0KGxvY2F0aW9uLmhyZWYpO1xyXG5cclxuICAgICAgICAvLyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcclxuICAgICAgICAvLyBldmVudCBhZnRlciBhbiBoaXN0b3J5IGNhbGxiYWNrIHdoaXRoIHBvcHN0YXRlXHJcbiAgICAgICAgJCgoKSA9PiB0aGlzLl9ydW4oKSk7XHJcblxyXG5cclxuICAgIH1cclxuICBcclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZ2V0IHRoZSBjdXJyZW50IHZpZXcgbmFtZSAodGhlIC97Vmlld30gbmFtZSBwYWdlKVxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VmlldygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VmlldztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHt7W119fSBnZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAqL1xyXG4gICAgZ2V0UXVlcnlQYXJhbWV0ZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge1VSTH0gZ2V0IHRoZSBjdXJyZW50IHVybFxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VXJsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBnZXQgdGhlIGN1cnJlbnQgc3RhdGUgKHVzZWx5IGFmdGVyIGEgcG9zdCwgYW5kIGRlY2xhcmVkIGZyb20gdGhlIG5vZGUgdmlldyBpbiB7c3RhdGV9IG9iamVjdClcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFN0YXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0IHRoZSByb3V0ZXIgb24gZWFjaCB1cmwgcmVxdWVzdGVkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jIGN1cnJlbnQgbG9jYXRpb24gaHJlZlxyXG4gICAgICovXHJcbiAgICBfaW5pdChsb2MpIHtcclxuICAgICAgICAvL3RoaXMuY3VycmVudFVybCA9IG5ldyB1cmlqcyhsb2MpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVybCA9IG5ldyBVUkwobG9jKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IHZpZXdcclxuICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdGhpcy5jdXJyZW50VXJsLnBhdGhuYW1lO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAgICB0aGlzLmN1cnJlbnRVcmwuc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge1BvcFN0YXRlRXZlbnR9IHBvcFN0YXRlRXZlbnQgXHJcbiAgICAqL1xyXG4gICAgX29uTG9jYXRpb25DaGFuZ2UocG9wU3RhdGVFdmVudCkge1xyXG4gICAgICAgIHZhciBzcmNFbGVtID0gcG9wU3RhdGVFdmVudC5zcmNFbGVtZW50O1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKCFzcmNFbGVtIHx8ICFzcmNFbGVtLmxvY2F0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlICYmIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQpXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKTtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX2luaXQoc3JjRWxlbS5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB0aGlzLl9ydW4oKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgX2NyZWF0ZUluc3RhbmNlKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgdmFyIGZhY3RvcnkgPSBjb25zdHJ1Y3Rvci5iaW5kLmFwcGx5KGNvbnN0cnVjdG9yLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgZmFjdG9yeSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3N0YXRlXSBcclxuICAgICAqL1xyXG4gICAgbmF2aWdhdGVUbyh1cmwsIHN0YXRlKSB7XHJcblxyXG4gICAgICAgIGlmICh1cmwgPT09IHRoaXMuY3VycmVudFVybC5wYXRobmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUgPyBzdGF0ZSA6IHt9LCBcIlwiLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aE5hbWUgOiBwYXRobmFtZSB1cmlcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHBhZ2VIYW5kbGVyXHJcbiAgICAqL1xyXG4gICAgcmVnaXN0ZXIocGF0aE5hbWUsIHBhZ2VIYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0KHBhdGhOYW1lLCBwYWdlSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgX3J1bigpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gJChcIiNyb3V0ZXJTdGF0ZVwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IEpTT04ucGFyc2UodGhpcy5jdXJyZW50U3RhdGUpO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudEtleTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXAuZm9yRWFjaCgodiwgaykgPT4ge1xyXG4gICAgICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAoaywgJ2knKTtcclxuICAgICAgICAgICAgbGV0IGlzTWF0Y2ggPSByLnRlc3QodGhpcy5jdXJyZW50Vmlldyk7XHJcbiAgICAgICAgICAgIGlmIChpc01hdGNoKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudEtleSA9IGs7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50S2V5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50UGFnZUN0b3IgPSB0aGlzLm1hcC5nZXQoY3VycmVudEtleSk7XHJcblxyXG4gICAgICAgIGlmICghY3VycmVudFBhZ2VDdG9yKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLl9jcmVhdGVJbnN0YW5jZShjdXJyZW50UGFnZUN0b3IpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFBhZ2UpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2Uub25Mb2FkKSB7XHJcbiAgICAgICAgICAgICQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZS5vbkxvYWQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlciBoYXMgbG9hZGVkIHBhZ2UgXCIgKyB0aGlzLmN1cnJlbnRWaWV3KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZS5vblVubG9hZCkge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ2JlZm9yZXVubG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLy8gc2luZ2xldG9uXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyByb3V0ZXIoKTtcclxuXHJcblxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vcm91dGVyLmpzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIGRhc2hib2FyZFBhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSW5kZXggZ2V0IHRoZSBjdXJyZW50IHBhZ2UgaW5kZXhcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaChwYWdlSW5kZXgpIHtcclxuICAgIH1cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBlbmdpbmVzUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9zaG93blBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9zaG93UGFuZWwgPSAoZSkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMuX3VubG9hZFBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBcInJpZ2h0XCI7XHJcbiAgICAgICAgdGhpcy5fY2VudGVyID0gXCJcIjtcclxuXHJcbiAgICAgICAgJCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtb2RhbEh0bWxEaXYgPSB0aGlzLmdlbmVyYXRlTW9kYWxIdG1sKCk7XHJcblxyXG4gICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKG1vZGFsSHRtbERpdik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhbmVsKCkub24oJ3Nob3duLmJzLm1vZGFsJywgdGhpcy5fc2hvd25QYW5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwoKS5vbignc2hvdy5icy5tb2RhbCcsIHRoaXMuX3Nob3dQYW5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFuZWwoKS5vbignaGlkZS5icy5tb2RhbCcsIHRoaXMuX3VubG9hZFBhbmVsKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIHNtKCkge1xyXG4gICAgICAgIHRoaXMuX2xhcmdlID0gXCJcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIGxnKCkge1xyXG4gICAgICAgIHRoaXMuX2xhcmdlID0gXCIgbW9kYWwtbGdcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgeGwoKSB7XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIiBtb2RhbC14bFwiO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gXCJcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIHJlYWRvbmx5KCkge1xyXG4gICAgICAgIHRoaXMuX2RhdGFfcmVhZG9ubHkgPSAnZGF0YS1iYWNrZHJvcD1cInN0YXRpY1wiIGRhdGEta2V5Ym9hcmQ9XCJmYWxzZVwiICc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgY2VudGVyKCkge1xyXG4gICAgICAgIHRoaXMuX2NlbnRlciA9IFwibW9kYWwtZGlhbG9nLWNlbnRlcmVkIG1vZGFsLWRpYWxvZy1zY3JvbGxhYmxlXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICpcclxuICAgICogQGNhbGxiYWNrIG9uTW9kYWxFdmVudFxyXG4gICAgKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50XHJcbiAgICAqL1xyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge29uTW9kYWxFdmVudH0gc2hvd25QYW5lbEV2ZW50IC0gQ2FsbGVkIHdoZW4gdGhlIHBhbmVsIGlzIHNob3duLlxyXG4gICAgICovXHJcbiAgICBvblNob3duKHNob3duUGFuZWxFdmVudCkgeyB0aGlzLl9zaG93blBhbmVsID0gc2hvd25QYW5lbEV2ZW50OyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge29uTW9kYWxFdmVudH0gc2hvd1BhbmVsRXZlbnQgLSBDYWxsZWQgd2hlbiB0aGUgcGFuZWwgaXMgbG9hZGluZywgYmVmb3JlIHNob3duLlxyXG4gICAgICovXHJcbiAgICBvblNob3coc2hvd1BhbmVsRXZlbnQpIHsgdGhpcy5fc2hvd1BhbmVsID0gc2hvd1BhbmVsRXZlbnQ7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7b25Nb2RhbEV2ZW50fSB1bmxvYWRQYW5lbEV2ZW50IC0gQ2FsbGVkIHdoZW4gdGhlIHBhbmVsIGlzIHVubG9hZGluZy5cclxuICAgICAqL1xyXG4gICAgb25VbkxvYWQodW5sb2FkUGFuZWxFdmVudCkgeyB0aGlzLl91bmxvYWRQYW5lbCA9IHVubG9hZFBhbmVsRXZlbnQ7IH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRWxlbWVudD59ICovXHJcbiAgICBwYW5lbCgpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9YCkgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0gKi9cclxuICAgIHN1Ym1pdEJ1dHRvbigpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9U3VibWl0QnV0dG9uYCkgfVxyXG5cclxuICAgIC8qKiAgQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59ICovXHJcbiAgICBkZWxldGVCdXR0b24oKSB7XHJcbiAgICAgICAgcmV0dXJuICQoYCMke3RoaXMuaWR9RGVsZXRlQnV0dG9uYClcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVCdXR0b25UZXh0KHRleHQpIHtcclxuICAgICAgICAkKGAjJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblRleHRgKS50ZXh0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59Ki9cclxuICAgIGNsb3NlQnV0dG9uKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1DbG9zZUJ1dHRvbmApIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGJvZHkoKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfUJvZHlgKSB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtKUXVlcnk8SFRNTEhSRWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRpdGxlKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1UaXRsZWApIH1cclxuXHJcblxyXG4gICAgZ2VuZXJhdGVNb2RhbEh0bWwoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RhbCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgJHt0aGlzLl9wb3NpdGlvbn0gZmFkZVwiIGlkPVwiJHt0aGlzLmlkfVwiIHRhYmluZGV4PVwiLTFcIiAke3RoaXMuX2RhdGFfcmVhZG9ubHl9YXJpYS1sYWJlbGxlZGJ5PVwiJHt0aGlzLmlkfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nJHt0aGlzLl9sYXJnZX0gJHt0aGlzLl9jZW50ZXJ9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCR7dGhpcy5fbGFyZ2V9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiIGlkPVwiJHt0aGlzLmlkfVRpdGxlXCI+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiIGlkPVwiJHt0aGlzLmlkfUJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYXJrIGJ0bi1zbVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgaWQ9XCIke3RoaXMuaWR9Q2xvc2VCdXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXVuZG9cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDbG9zZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgaWQ9XCIke3RoaXMuaWR9U3VibWl0QnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zYXZlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3VibWl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi1zbVwiIGlkPVwiJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJhc2gtYWx0XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCIke3RoaXMuaWR9RGVsZXRlQnV0dG9uVGV4dFwiPkRlbGV0ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGFsO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu79cclxuXHJcbmV4cG9ydCBjbGFzcyBjb25zb2xlMiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxEaXZFbGVtZW50Pn0gcGFyZW50T3ZlcmZsb3dFbGVtZW50XHJcbiAgICAgKiovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBwYXJlbnRPdmVyZmxvd0VsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxUb3AgPSB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQucG9zaXRpb24oKS50b3A7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cuUHJpc20gPSB3aW5kb3cuUHJpc20gfHwge307XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHdpbmRvdy5QcmlzbS5tYW51YWwgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLl9tZ3Rsb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZ3Rsb2dpbicpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBfdXNlck5hbWUoKSB7XHJcblxyXG4gICAgICAgIGxldCB1c2VyTmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9tZ3Rsb2dpbiAmJiB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscykge1xyXG5cclxuICAgICAgICAgICAgbGV0IG1haWwgPSB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgaWYgKCFtYWlsKVxyXG4gICAgICAgICAgICAgICAgbWFpbCA9IHRoaXMuX21ndGxvZ2luLnVzZXJEZXRhaWxzLnVzZXJQcmluY2lwYWxOYW1lO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5hbWVNYXRjaCA9IG1haWwubWF0Y2goL14oW15AXSopQC8pO1xyXG4gICAgICAgICAgICB1c2VyTmFtZSA9IG5hbWVNYXRjaCA/IG5hbWVNYXRjaFsxXSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdXNlck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3Njcm9sbFRvRW5kKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9jb25zb2xlMi5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbmV3UG9zID0gdGhpcy5faW5pdGlhbFRvcCArIGhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50LnNjcm9sbFRvKG5ld1BvcywgMTAwKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kT2JqZWN0KGpzb25PYmplY3QpIHtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxldCBqc29uU3RyaW5nID0gUHJpc20uaGlnaGxpZ2h0KEpTT04uc3RyaW5naWZ5KGpzb25PYmplY3QsIG51bGwsIDIpLCBQcmlzbS5sYW5ndWFnZXMuanNvbiwgJ2pzb24nKTtcclxuXHJcbiAgICAgICAgbGV0IHN0ciA9IFwiPHByZSBjbGFzcz0nbWwtMyBtci0zIG10LTMnIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOndoaXRlO3doaXRlLXNwYWNlOnByZS13cmFwO3dpZHRoOjkwJTttYXgtaGVpZ2h0OjI1MHB4Oyc+PGNvZGU+XCI7XHJcbiAgICAgICAgc3RyICs9IGpzb25TdHJpbmc7XHJcbiAgICAgICAgc3RyICs9IFwiPC9jb2RlPjwvcHJlPlwiO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFwcGVuZFdhcm5pbmcobGluZSkge1xyXG5cclxuICAgICAgICBsZXQgc3RyID0gYDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3dcIj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdhcm5pbmdcIj4ke3RoaXMuX3VzZXJOYW1lKCl9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj46PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2FybmluZ1wiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRFcnJvcihsaW5lKSB7XHJcblxyXG4gICAgICAgIGxldCBzdHIgPSBgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvd1wiPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2cobGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGluZm8obGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGVycm9yKGxpbmUpIHsgdGhpcy5hcHBlbmRFcnJvcihsaW5lKTsgfVxyXG4gICAgd2FybihsaW5lKSB7IHRoaXMuYXBwZW5kV2FybmluZyhsaW5lKTsgfVxyXG5cclxuXHJcbiAgICBhcHBlbmRMaW5lKGxpbmUpIHtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHN0ciA9IGA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93XCI+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuLy9leHBvcnQgZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4vLyAgICB0aGlzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4vLyAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4vL31cclxuLy9leHBvcnQgZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuLy8gICAgdGhpcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuLy8gICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG5cclxuLy99XHJcblxyXG4vLy8qKlxyXG4vLyAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhX3VybFxyXG4vLyAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4vLyAqL1xyXG4vL2V4cG9ydCBmdW5jdGlvbiBsb2FkUGFydGlhbEFzeW5jKGRhdGFfdXJsLCBlbGVtZW50KSB7XHJcbi8vICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbi8vICAgICAgICBlbGVtZW50LmxvYWQoZGF0YV91cmwsIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpID0+IHtcclxuLy8gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4vLyAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4vLyAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuLy8gICAgICAgIH0pO1xyXG4vLyAgICB9KTtcclxuLy99XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgaGFuZGxlcnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWV0aG9kcyA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdNZXRob2RcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lIHx8ICFuZXdNZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gaGFuZGxlcnMgYWxyZWFkeSwgY3JlYXRlIGFuIGVtcHR5IGFycmF5XHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0pIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQcmV2ZW50aW5nIGFkZGluZyB0aGUgc2FtZSBoYW5kbGVyIG11bHRpcGxlIHRpbWVzLlxyXG4gICAgICAgIGlmICh0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0uaW5kZXhPZihuZXdNZXRob2QpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgdGhlIG1ldGhvZCB0byB0aGUgaGFuZGxlciBsaXN0XHJcbiAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdLnB1c2gobmV3TWV0aG9kKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGFuIGhhbmRsZXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIG1ldGhvZCBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gbWV0aG9kICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kTmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIGdldCBhbGwgaGFuZGxlcnMgd2l0aCB0aGlzIG1ldGhvZCBuYW1lXHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcblxyXG4gICAgICAgIC8vIGlmIGhhbmRsZXJzIGRvIG5vdCBleGlzdHMsIHJldHVyblxyXG4gICAgICAgIGlmICghaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uIGV4aXN0aW5nXHJcbiAgICAgICAgaWYgKG1ldGhvZCkge1xyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiBhbGwgaGFuZGxlcnNcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlSWR4ID0gaGFuZGxlcnMuaW5kZXhPZihtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgd2UgZm91bmQgaXQsIG1ha2UgYSBzcGxpY2UgaW4gdGhlIGhhbmRsZXJzIGxpc3RcclxuICAgICAgICAgICAgaWYgKHJlbW92ZUlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShyZW1vdmVJZHgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIG5vIG1vcmUgaGFuZGxlcnMsIGRlbGV0ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0ICAgXHJcbiAgICAgKi9cclxuICAgIGludm9rZSh0YXJnZXQsIC4uLnBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBtZXRob2RzIGFycmF5IHRvIGludm9rZVxyXG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLm1ldGhvZHNbdGFyZ2V0LnRvTG93ZXJDYXNlKCldO1xyXG5cclxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uIG1ldGhvZCBpbiB0aGUgbWV0aG9kcyBhcnJheSB0byBpbnZva2VcclxuICAgICAgICBpZiAobWV0aG9kcykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG0uYXBwbHkoX3RoaXMsIHBhcmFtZXRlcnMpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBIGNhbGxiYWNrIGZvciB0aGUgbWV0aG9kICR7dGFyZ2V0LnRvTG93ZXJDYXNlKCl9IHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTm8gY2xpZW50IG1ldGhvZCB3aXRoIHRoZSBuYW1lICcke3RhcmdldC50b0xvd2VyQ2FzZSgpfScgZm91bmQuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vd3d3cm9vdC9saWIvc2lnbmFsci9kaXN0L2Jyb3dzZXIvc2lnbmFsci5qc1wiIC8+XHJcblxyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuL2hlbHBlcnMuanNcIjtcclxuaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tIFwiLi9oYW5kbGVycy5qc1wiXHJcblxyXG4vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBub3RpZmljYXRpb24ge1xyXG5cclxuICAgIC8vIHNpbmdsZXRvblxyXG4gICAgc3RhdGljIF9jdXJyZW50O1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7bm90aWZpY2F0aW9ufSAqL1xyXG4gICAgc3RhdGljIGdldCBjdXJyZW50KCkge1xyXG4gICAgICAgIGlmICghbm90aWZpY2F0aW9uLl9jdXJyZW50KVxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uX2N1cnJlbnQgPSBuZXcgbm90aWZpY2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uX2N1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvLyBldmVudHNcclxuICAgIHN0YXRpYyBPblN0YXJ0ZWQgPSBcIk9uU3RhcnRlZFwiO1xyXG4gICAgc3RhdGljIE9uU3RvcHBlZCA9IFwiT25TdG9wcGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0ZWQgPSBcIk9uQ29ubmVjdGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0aW5nID0gXCJPbkNvbm5lY3RpbmdcIjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlcnMgPSBuZXcgaGFuZGxlcnMoKTtcclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IHNpZ25hbFIuSHViQ29ubmVjdGlvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAuY29uZmlndXJlTG9nZ2luZyhzaWduYWxSLkxvZ0xldmVsLk5vbmUpXHJcbiAgICAgICAgICAgIC53aXRoVXJsKCcvbm90aWZpY2F0aW9ucycpXHJcbiAgICAgICAgICAgIC53aXRoQXV0b21hdGljUmVjb25uZWN0KClcclxuICAgICAgICAgICAgLmNvbmZpZ3VyZUxvZ2dpbmcoc2lnbmFsUi5Mb2dMZXZlbC5UcmFjZSlcclxuICAgICAgICAgICAgLmJ1aWxkKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbnJlY29ubmVjdGluZyhlcnJvciA9PiB0aGlzLl9jb25zb2xlLmxvZyhlcnJvcikpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbmNsb3NlKGVycm9yID0+IHRoaXMub25Db25uZWN0aW9uRXJyb3IoZXJyb3IpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uKFwiY29ubmVjdGVkXCIsIChfKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgICAgIGxldCByZXRyeUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3RhcnRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaWxlICghdGhpcy5faXNDb25uZWN0ZWQgJiYgcmV0cnlDb3VudCA8IDUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHJ5Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgPT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZyk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc3RhcnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgZGVsYXkoMTUwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkIHx8IHJldHJ5Q291bnQgPj0gNSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXJ0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IHRyaWVzIHRvIGNvbm5lY3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uU3RhcnRlZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgIT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLmludm9rZShub3RpZmljYXRpb24uT25TdG9wcGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9uKG1ldGhvZCwgaGFuZGxlcik7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub24obWV0aG9kLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBvbkNvbm5lY3Rpb25FcnJvcihlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciAmJiBlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUge1xyXG5cclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxEZWxldGVFbmdpbmUobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5jbGljayhhc3luYyAoZXZlbnQpID0+IHsgYXdhaXQgdGhpcy5kZWxldGVFbmdpbmVBc3luYyhldmVudCkgfSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmRlbGV0ZUNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgICAgIC8vIHN1YnNjcmliZSB0byBldmVudCBmcm9tIHNpZ25hbHIgYWJvdXQgZGVwbG95bWVudFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0YXJ0ZWQuXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RpbmcuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0b3BwZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RvcHBlZC5cIikpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0UmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlcXVlc3RSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICQobG9jYXRpb24pLmF0dHIoJ2hyZWYnLCAnL0FkbWluL0luZGV4Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0ID0gYXdhaXQgZW5naW5lUmVxdWVzdFJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lUmVxdWVzdCkge1xyXG4gICAgICAgICAgICAkKGxvY2F0aW9uKS5hdHRyKCdocmVmJywgJy8nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5zaG93KCk7XHJcblxyXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdtLTInPkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgZW5naW5lIDxiPlwiICsgZW5naW5lUmVxdWVzdC5lbmdpbmVOYW1lICsgXCI8L2I+ID88L2Rpdj5cIikuaW5zZXJ0QmVmb3JlKHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIlJlYWR5IHRvIGRlbGV0ZS4gUGxlYXNlIHByZXNzICdEZWxldGUnIGJ1dHRvbiB0byBzdGFydC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7SlF1ZXJ5LkNsaWNrRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQsIG51bGwsIEhUTUxCdXR0b25FbGVtZW50LCBIVE1MQnV0dG9uRWxlbWVudD59IGV2dCAqL1xyXG4gICAgYXN5bmMgZGVsZXRlRW5naW5lQXN5bmMoZXZ0KSB7XHJcblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZW5naW5lSWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHRoZSBlbmdpbmUgcmVxdWVzdCBpZC4uLi5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBub3RpZmljYXRpb24gaGVscGVyXHJcbiAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIHRoaXMgZGVwbG95bWVudCAoZm9yIHRoaXMgdXNlcilcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5lbmdpbmVJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiV2FpdGluZyBmb3IgYW4gYWdlbnQgdG8gZW5xdWV1ZSB0aGUgZW5naW5lIGRyb3Agb3BlcmF0aW9uLi4uXCIpO1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBsZXQgdXJsRGVsZXRpb24gPSBgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmxEZWxldGlvbiwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBkZWxldGUgdGhlIGVuZ2luZSByZXF1ZXN0IHdpdGggSWQgJHt0aGlzLmVuZ2luZUlkfSBgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRyb3BFbmdpbmVTdGFydCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUoZHJvcEVuZ2luZVN0YXJ0KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9waW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwIDxzdHJvbmc+JHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9PC9zdHJvbmc+IC4uLmApXHJcblxyXG4gICAgICAgIGxldCByZ1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZ1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlR3JvdXAgPSBhd2FpdCByZ1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZUdyb3VwKTtcclxuXHJcbiAgICAgICAgbGV0IHJnTGlua1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9L2xpbmtgLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGlkOiByZXNvdXJjZUdyb3VwLmlkIH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZ0xpbmtSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCByZXNvdXJjZSBncm91cCBsaW5rLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXNvdXJjZUdyb3VwTGluayA9IGF3YWl0IHJnTGlua1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEF6dXJlIHJlc291cmNlIGdyb3VwIGxpbmsgOiA8YSBocmVmPSR7cmVzb3VyY2VHcm91cExpbmsudXJpfSB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlR3JvdXAubmFtZX08L2E+YClcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERvbmUuYClcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9waW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsRGF0YWJyaWNrcyB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbERhdGFicmlja3MobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwOiA8c3Ryb25nPiR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfTwvc3Ryb25nPi5gKVxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEYXRhYnJpY2tzIHdvcmtzcGFjZTogPHN0cm9uZz4ke2VuZ2luZS5jbHVzdGVyTmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEF6dXJlLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhYnJpY2tzLyR7ZW5naW5lLmlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhYnJpY2tzIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlID0gYXdhaXQgcmVzb3VyY2VSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QocmVzb3VyY2UpO1xyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VMaW5rUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX0vbGlua2AsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaWQ6IHJlc291cmNlLmlkIH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZUxpbmtSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCByZXNvdXJjZSBsaW5rLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmsgPSBhd2FpdCByZXNvdXJjZUxpbmtSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBBenVyZSBEYXRhYnJpa3Mgd29ya3NwYWNlIGxpbms6IDxhIGhyZWY9XCIke3Jlc291cmNlTGluay51cml9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRGF0YWJyaWNrcyB3b3Jrc3BhY2UgbGluazogPGEgaHJlZj1cImh0dHBzOi8vJHtyZXNvdXJjZS5wcm9wZXJ0aWVzLndvcmtzcGFjZVVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlLm5hbWV9PC9hPmApXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gRGF0YWJyaWNrcy4uLmApXHJcblxyXG4gICAgICAgIHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhYnJpY2tzLyR7ZW5naW5lLmlkfS9jbHVzdGVyYCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGRhdGFicmlja3MgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEb25lLmApXHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcGluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9wcGVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbERhdGFGYWN0b3J5IHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGF0YUZhY3RvcnkobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwIDxzdHJvbmc+JHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9PC9zdHJvbmc+IC4uLmApXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERhdGEgZmFjdG9yeSBWMjogPHN0cm9uZz4ke2VuZ2luZS5mYWN0b3J5TmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEF6dXJlLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lLmlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhIGZhY3RvcnkgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2UgPSBhd2FpdCByZXNvdXJjZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmtSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3Jlc291cmNlZ3JvdXBzLyR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfS9saW5rYCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZDogcmVzb3VyY2UuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlTGluayA9IGF3YWl0IHJlc291cmNlTGlua1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEF6dXJlIHJlc291cmNlIGdyb3VwIGxpbmsgOiA8YSBocmVmPSR7cmVzb3VyY2VMaW5rLnVyaX0gdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFByZXZpZXcge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFByZXZpZXcobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3ID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnhsKCkuY2VudGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxQcmV2aWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkudGV4dCgnTG9hZGluZyAuLi4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdmFyIGVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VOYW1lID0gYnV0dG9uLmRhdGEoJ2RhdGEtc291cmNlLW5hbWUnKVxyXG4gICAgICAgIHZhciBzY2hlbWFOYW1lID0gYnV0dG9uLmRhdGEoJ3NjaGVtYS1uYW1lJylcclxuICAgICAgICB2YXIgdGFibGVOYW1lID0gYnV0dG9uLmRhdGEoJ3RhYmxlLW5hbWUnKVxyXG5cclxuXHJcbiAgICAgICAgbGV0IHByZXZpZXdSb3dzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9BenVyZVNxbERhdGFiYXNlLyR7ZW5naW5lSWR9LyR7ZGF0YVNvdXJjZU5hbWV9L3RhYmxlcy8ke3NjaGVtYU5hbWV9LyR7dGFibGVOYW1lfS9wcmV2aWV3YCk7XHJcblxyXG4gICAgICAgIGlmIChwcmV2aWV3Um93c1Jlc3BvbnNlLnN0YXR1cyAhPSA0MDApIHtcclxuICAgICAgICAgICAgbGV0IHByZXZpZXdSb3dzID0gYXdhaXQgcHJldmlld1Jvd3NSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJldmlld1Jvd3MubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuYXBwZW5kKFwiPHRhYmxlIGlkPSd0YWJsZSc+PC90YWJsZT5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJvdzEgPSBwcmV2aWV3Um93c1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY29sdW1ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbyBpbiByb3cxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IG8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBvXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnI3RhYmxlJykuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcHJldmlld1Jvd3NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkudGV4dCgnTm8gcm93cy4uLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFVzZXJzIHtcclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxVc2Vycyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnNtKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxVc2VycztcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkudGV4dCgnTG9hZGluZyAuLi4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcbiAgICAgICAgdmFyIHVzZXJzSWRzVmFsID0gYnV0dG9uLmRhdGEoJ3VzZXJzLWlkJykgLy8gRXh0cmFjdCBpbmZvIGZyb20gZGF0YS0qIGF0dHJpYnV0ZXNcclxuXHJcbiAgICAgICAgaWYgKCF1c2Vyc0lkc1ZhbCB8fCB1c2Vyc0lkc1ZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS50ZXh0KCdOb3RoaW5nIHRvIHNob3cuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1c2Vyc0lkcyA9IHVzZXJzSWRzVmFsLnNwbGl0KCcsJykubWFwKHYgPT4gdi50cmltKCkpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVzZXJzSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpID09PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHVzZXJJZCA9IHVzZXJzSWRzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF1c2VySWQgfHwgdXNlcklkID09ICcnKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmFwcGVuZChcclxuICAgICAgICAgICAgICAgIFwiPGRpdiBjbGFzcz0nbS0zJyBzdHlsZT0nb3ZlcmZsb3c6YXV0bzsnPjxtZ3QtcGVyc29uIHVzZXItaWQ9J1wiICsgdXNlcnNJZHNbaV0gKyBcIicgZmV0Y2gtaW1hZ2U9J3RydWUnIHBlcnNvbi1jYXJkPSdob3Zlcicgdmlldz0ndHdvTGluZXMnPjwvbWd0LXBlcnNvbj48L2Rpdj5cIlxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7XHJcbiAgICBtb2RhbFBhbmVsVXNlcnMsXHJcbiAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLFxyXG4gICAgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAsXHJcbiAgICBtb2RhbFBhbmVsRGF0YWJyaWNrcyxcclxuICAgIG1vZGFsUGFuZWxEYXRhRmFjdG9yeVxyXG59IGZyb20gXCIuLi9tb2RhbC9pbmRleC5qc1wiO1xyXG5cclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBlbmdpbmVEZXRhaWxzUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRNZW1iZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0TWVtYmVyc1wiKTtcclxuXHJcbiAgICAgICAgbW9kYWxQYW5lbERlbGV0ZUVuZ2luZS5pbml0aWFsaXplKFwicGFuZWxEZWxldGVFbmdpbmVcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuaW5pdGlhbGl6ZShcInBhbmVsUmVzb3VyY2VHcm91cFwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsRGF0YWJyaWNrcy5pbml0aWFsaXplKFwicGFuZWxEYXRhYnJpY2tzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhRmFjdG9yeS5pbml0aWFsaXplKFwicGFuZWxEYXRhRmFjdG9yeVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9ICQoXCIjSWRcIik7XHJcblxyXG4gICAgICAgIGlmICgkKFwiI2NvbnNvbGVcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIgPSBuZXcgY29uc29sZTIoJChcIiNjb25zb2xlXCIpLCAkKCdkaXYuZG9ja2luZy1mb3JtJykpO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RhcnRlZCwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuY29ubmVjdGlvbi5pbnZva2UoJ1N1YnNjcmliZURlcGxveW1lbnRBc3luYycsIHRoaXMuaWQudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3lpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub2ZmKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu79leHBvcnQgY2xhc3MgZG90bWltdGFibGUge1xyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCB1cmwsIHVybENvdW50LCBwYWdlU2l6ZSkge1xyXG5cclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMudXJsQ291bnQgPSB1cmxDb3VudCA/PyB0aGlzLnVybCArIFwiL2NvdW50XCI7XHJcblxyXG4gICAgICAgIHRoaXMuc3Bpbm5lciA9ICQoJyNzcGlubmVyLScgKyBuYW1lKTtcclxuICAgICAgICB0aGlzLmJvZHkgPSAkKCcjdGJvZHktJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXMgPSAkKCcjcHJldmlvdXMtJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMubmV4dCA9ICQoJyNuZXh0LScgKyBuYW1lKTtcclxuICAgICAgICB0aGlzLnJlZnJlc2ggPSAkKCcjcmVmcmVzaC0nICsgbmFtZSk7XHJcblxyXG4gICAgICAgIC8vIGRpc2FibGUgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMucHJldmlvdXMucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgICAgICAvLyBnZXQgYSBwYWdlXHJcbiAgICAgICAgdGhpcy5wYWdlSW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuaXRlbXNDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5wYWdlU2l6ZSA9IHBhZ2VTaXplID8/IDI7XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaC5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnByZXZpb3VzLmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXggLSAxO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0LmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXggKyAxO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkKCkge1xyXG4gICAgICAgIGxldCB1cmwgPSB0aGlzLnVybCArICc/cGFnZUluZGV4PScgKyB0aGlzLnBhZ2VJbmRleCArICcmY291bnQ9JyArIHRoaXMucGFnZVNpemU7XHJcblxyXG4gICAgICAgIHRoaXMuc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgICAgLy9sZXQgZCA9IGF3YWl0ICQuZ2V0SlNPTih1cmwpO1xyXG5cclxuICAgICAgICB0aGlzLmJvZHkubG9hZCh1cmwsIChkLCBzdGF0dXMsIHhocikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBcImVycm9yXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZCB8fCBkLnRyaW0oKSA9PSAnJylcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJSb3dzKCdObyBkYXRhJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZURpc2FibGVCdXR0b25zKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJ1bigpIHtcclxuICAgICAgICB0aGlzLnNwaW5uZXIuc2hvdygpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJSb3dzKCk7XHJcblxyXG4gICAgICAgICQuZ2V0SlNPTih0aGlzLnVybENvdW50LCBkYXRhID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0NvdW50ID0gZGF0YS5jb3VudDtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICAgICAgfSkuZmFpbCgoZXJyb3IpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBlcnJvclN0cmluZyA9IGVycm9yLnJlc3BvbnNlSlNPTiA/IChlcnJvci5yZXNwb25zZUpTT04uZXJyb3IgPz8gZXJyb3IucmVzcG9uc2VKU09OKSA6IGVycm9yLnJlc3BvbnNlVGV4dDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWRkRmlyc3RSb3dXYXJuaW5nKGVycm9yU3RyaW5nKTtcclxuICAgICAgICAgICAgdGhpcy5zcGlubmVyLmhpZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVEaXNhYmxlQnV0dG9ucygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEZpcnN0Um93V2FybmluZyh0ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5ib2R5LmNoaWxkcmVuKCd0cicpLmFkZENsYXNzKCdiZy1kYW5nZXInKTtcclxuICAgICAgICB0aGlzLmJvZHkuY2hpbGRyZW4oJ3RyJykuY2hpbGRyZW4oJ3RkJykuYWRkQ2xhc3MoJ3RleHQtbGlnaHQnKS5hcHBlbmQodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJSb3dzKHRleHQpIHtcclxuICAgICAgICBsZXQgY29sdW1uc0NvdW50ID0gdGhpcy5ib2R5LnBhcmVudCgpLmZpbmQoJ3RoJykubGVuZ3RoO1xyXG4gICAgICAgIGlmICghY29sdW1uc0NvdW50KVxyXG4gICAgICAgICAgICBjb2x1bW5zQ291bnQgPSB0aGlzLmJvZHkucGFyZW50KCkuZmluZCgndHInKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFjb2x1bW5zQ291bnQpXHJcbiAgICAgICAgICAgIGNvbHVtbnNDb3VudCA9IDE7XHJcblxyXG4gICAgICAgIHRleHQgPSB0ZXh0ID8/ICcmbmJzcDsnO1xyXG5cclxuICAgICAgICB0aGlzLmJvZHkuaHRtbCgnPHRyPjx0ZCBjb2xzcGFuPScgKyBjb2x1bW5zQ291bnQgKyAnPicgKyB0ZXh0ICsgJzwvdGQ+PC90cj4nKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZW5hYmxlRGlzYWJsZUJ1dHRvbnMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhZ2VJbmRleCA8PSAwKVxyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91cy5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgaWYgKCh0aGlzLnBhZ2VJbmRleCArIDEpICogdGhpcy5wYWdlU2l6ZSA+PSB0aGlzLml0ZW1zQ291bnQpXHJcbiAgICAgICAgICAgIHRoaXMubmV4dC5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMubmV4dC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vcm91dGVyLmpzXCI7XHJcbmltcG9ydCB7IGRvdG1pbXRhYmxlIH0gZnJvbSBcIi4uL2RvdG1pbXRhYmxlLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBhZG1pblBhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uVW5sb2FkKCkge1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgZGVsYXkgfSBmcm9tIFwiLi4vaGVscGVycy5qc1wiXHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCI7XHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5pbXBvcnQgeyBtb2RhbFBhbmVsVXNlcnMgfSBmcm9tIFwiLi4vbW9kYWwvbW9kYWxQYW5lbFVzZXJzLmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSAkKFwiI0VuZ2luZVZpZXdfSWRcIik7XHJcbiAgICAgICAgdGhpcy5jb25zb2xlMiA9IG5ldyBjb25zb2xlMigkKFwiI2NvbnNvbGVcIiksICQoJ2Rpdi5kb2NraW5nLWZvcm0nKSk7XHJcbiAgICAgICAgdGhpcy5sYXVuY2hCdXR0b24gPSAkKCcjbGF1bmNoJyk7XHJcbiAgICAgICAgdGhpcy5sYXVuY2hCdXR0b24ucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlkIHx8ICF0aGlzLmlkLnZhbCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhcIkNhbid0IGxhdW5jaCBkZXBsb3ltZW50LiBObyBlbmdpbmUgcmVxdWVzdCAuLi5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIGV2ZW50IGZyb20gc2lnbmFsciBhYm91dCBkZXBsb3ltZW50XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuY29ubmVjdGlvbi5pbnZva2UoJ1N1YnNjcmliZURlcGxveW1lbnRBc3luYycsIHRoaXMuaWQudmFsKCkpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBzdGFydGVkLlwiKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiUmVhZHkgdG8gZGVwbG95LlwiKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKVxyXG4gICAgICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZywgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgY29ubmVjdGluZy4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0b3BwZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0b3BwZWQuXCIpKTtcclxuXHJcbiAgICAgICAgLy8gSnVzdCBpbiBjYXNlIGl0J3Mgbm90IHN0YXJ0ZWQgKGJ1dCBzaG91bGQgYmUgZG9uZSBhbHJlYWR5IGZyb20gaG9tZVBhZ2UuanMpXHJcbiAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sYXVuY2hCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIExhdW5jaCBhIHZhbGlkYXRpb24gYmVmb3JlXHJcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gJChcImZvcm1cIikudmFsaWQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaXNWYWxpZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubGF1bmNoSm9iQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBsYXVuY2hKb2JBc3luYygpIHtcclxuICAgICAgICB0aGlzLmNvbnNvbGUyLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkRlcGxveW1lbnQgc3RhcnRlZC5cIilcclxuICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaWQgfHwgIXRoaXMuaWQudmFsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKFwiQ2FuJ3QgbGF1bmNoIGRlcGxveW1lbnQuIE5vIGVuZ2luZSByZXF1ZXN0IC4uLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJTYXZpbmcgZGVwbG95bWVudCBwcm9wZXJ0aWVzLi4uXCIpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBGaXJzdCwgc2F2ZSB0aGUgZGVwbG95bWVudC5cclxuICAgICAgICAgICAgYXdhaXQgJC5wb3N0KCcnLCAkKCdmb3JtJykuc2VyaWFsaXplKCkpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBzYXZlIGVuZ2luZSBkZXRhaWxzYCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KGUucmVzcG9uc2VKU09OKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiV2FpdGluZyBmb3IgYW4gYWdlbnQgdG8gZW5xdWV1ZSB0aGUgZGVwbG95bWVudC4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHVybCBmb3IgdGhhdCBwYXJ0aWN1bGFyIGRlcGxveW1lbnRcclxuICAgICAgICAgICAgbGV0IHVybCA9IGAvYXBpL2VuZ2luZXMvJHt0aGlzLmlkLnZhbCgpfS9kZXBsb3lgO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoYDxiPkRlcGxveW1lbnQ8L2I+ICR7dGhpcy5pZC52YWwoKX0gY2FuIG5vdCBiZSBkZXBsb3llZC4uLmApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9ySnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QoZXJyb3JKc29uKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGRlcGxveW1lbnRzdGFydCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveW1lbnRzdGFydClcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGBVbmFibGUgdG8gZGVwbG95IGVuZ2luZWApO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdChlLnJlc3BvbnNlSlNPTik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3lpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHtcclxuICAgIG1vZGFsUGFuZWxVc2VycyxcclxuICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUsXHJcbiAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCxcclxuICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLFxyXG4gICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5XHJcbn0gZnJvbSBcIi4uL21vZGFsL2luZGV4LmpzXCI7XHJcblxyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGFkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLmluaXRpYWxpemUoXCJwYW5lbERlbGV0ZUVuZ2luZVwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cC5pbml0aWFsaXplKFwicGFuZWxSZXNvdXJjZUdyb3VwXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLmluaXRpYWxpemUoXCJwYW5lbERhdGFicmlja3NcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5LmluaXRpYWxpemUoXCJwYW5lbERhdGFGYWN0b3J5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gJChcIiNJZFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCQoXCIjY29uc29sZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMiA9IG5ldyBjb25zb2xlMigkKFwiI2NvbnNvbGVcIiksICQoJ2Rpdi5kb2NraW5nLWZvcm0nKSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3lpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub2ZmKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwi77u/XG5cbmV4cG9ydCBjbGFzcyBtZ3Rsb2FkZXIge1xuXHJcblxuICAgIHN0YXRpYyBzZXRNZ3RQcm92aWRlcigpIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgbWd0LlByb3h5UHJvdmlkZXIoXCIvYXBpL1Byb3h5XCIpO1xuICAgICAgICBwcm92aWRlci5sb2dpbiA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9BY2NvdW50L1NpZ25Jbj9yZWRpcmVjdFVyaT0nICsgd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIHByb3ZpZGVyLmxvZ291dCA9ICgpID0+IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9NaWNyb3NvZnRJZGVudGl0eS9BY2NvdW50L1NpZ25PdXQnO1xuXG4gICAgICAgIG1ndC5Qcm92aWRlcnMuZ2xvYmFsUHJvdmlkZXIgPSBwcm92aWRlcjtcbiAgICB9XG5cbiAgICBzdGF0aWMgaW50ZXJjZXB0TWd0TG9naW4oKSB7XG4gICAgICAgIHZhciBtZ3Rsb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZ3Rsb2dpbicpO1xuXG4gICAgICAgIC8vLy8gVGhlc2VzIGV2ZW50cyBhcmUgcmFpc2VkIHdoZW4gdXNlciBjbGljayBvbiBsb2dpbiBvdXIgbG9nb3V0IGJ1dHRvblxuICAgICAgICAvLy8vIFRoZXlyIGFyZSBub3QgcmFpc2VkIGF0IHRoZSBnb29kIHRpbWluZ1xuICAgICAgICAvLy8vIFNob3VsZCBiZSByZW5hbWVkICdsb2dpbkNsaWNrJyBhbmQgJ2xvZ291dENsaWNrJ1xuICAgICAgICAvL21ndGxvZ2luLmFkZEV2ZW50TGlzdGVuZXIoJ2xvZ2luQ29tcGxldGVkJywgKCkgPT4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ1c2VyZGV0YWlsc1wiKSk7XG4gICAgICAgIC8vbWd0bG9naW4uYWRkRXZlbnRMaXN0ZW5lcignbG9nb3V0Q29tcGxldGVkJywgKCkgPT4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJ1c2VyZGV0YWlsc1wiKSk7XG5cbiAgICAgICAgLy8vLyBnZXQgbG9jYWwgc3RvcmFnZSBpdGVtIGlmIGFueVxuICAgICAgICAvL3ZhciB1c2VyRGV0YWlsc0Zyb21TdG9yYWdlU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJkZXRhaWxzJyk7XG5cbiAgICAgICAgLy9pZiAodXNlckRldGFpbHNGcm9tU3RvcmFnZVN0cmluZyAhPT0gbnVsbCAmJiBtZ3Rsb2dpbi51c2VyRGV0YWlscyA9PT0gbnVsbClcbiAgICAgICAgLy8gICAgbWd0bG9naW4udXNlckRldGFpbHMgPSBKU09OLnBhcnNlKHVzZXJEZXRhaWxzRnJvbVN0b3JhZ2VTdHJpbmcpO1xuXG4gICAgICAgIC8vLy8gTG9hZGluZyBjb21wbGV0ZWQgaXMgY29ycmVjdGx5IGZpcmVkIEFGVEVSIGNvbXBvbmVudCBpcyBsb2FkZWQgQU5EIHVzZXIgbG9nZ2VkIGluXG4gICAgICAgIC8vbWd0bG9naW4uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGluZ0NvbXBsZXRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gICAgaWYgKG1ndGxvZ2luLnVzZXJEZXRhaWxzICE9PSBudWxsKVxuICAgICAgICAvLyAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJkZXRhaWxzJywgSlNPTi5zdHJpbmdpZnkobWd0bG9naW4udXNlckRldGFpbHMpKTtcbiAgICAgICAgLy99KTtcblxuICAgIH1cbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tIFwiLi9oYW5kbGVycy5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgYXV0aCB7XHJcblxyXG5cclxuXHQvLyBzaW5nbGV0b25cclxuXHRzdGF0aWMgX2N1cnJlbnQ7XHJcblxyXG5cdC8qKiBAcmV0dXJucyB7YXV0aH0gKi9cclxuXHRzdGF0aWMgZ2V0IGN1cnJlbnQoKSB7XHJcblx0XHRpZiAoIWF1dGguX2N1cnJlbnQpXHJcblx0XHRcdGF1dGguX2N1cnJlbnQgPSBuZXcgYXV0aCgpO1xyXG5cclxuXHRcdHJldHVybiBhdXRoLl9jdXJyZW50O1xyXG5cdH1cclxuXHJcblx0c3RhdGljIE9uQXV0aGVudGljYXRlZCA9IFwiT25BdXRoZW50aWNhdGVkXCJcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmhhbmRsZXJzID0gbmV3IGhhbmRsZXJzKCk7XHJcblxyXG5cdFx0LyoqIEB0eXBlIGJvb2xlYW4gKi9cclxuXHRcdHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZ2xvYmFsVXNlckF1dGhlbnRpY2F0ZWQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKCkge1xyXG5cclxuXHRcdCQoKCkgPT4ge1xyXG5cdFx0XHQvLyBpbnZva2UgYWxsIGhhbmRsZXJzIHRvIE9uQXV0aGVudGljYXRlZCB3aXRoIHRoZSBjb3JyZWN0IHZhbHVlXHJcblx0XHRcdHRoaXMuaGFuZGxlcnMuaW52b2tlKGF1dGguT25BdXRoZW50aWNhdGVkLCB0aGlzLmlzQXV0aGVudGljYXRlZCwgJ2Nvb2wnKVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRvbihtZXRob2ROYW1lLCBuZXdNZXRob2QpIHtcclxuXHRcdHRoaXMuaGFuZGxlcnMub24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKTtcclxuXHR9XHJcblxyXG5cdG9mZihtZXRob2ROYW1lLCBtZXRob2QpIHtcclxuXHRcdHRoaXMuaGFuZGxlcnMub2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCk7XHJcblx0fVxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4uL21vZGFsL21vZGFsUGFuZWwuanNcIjtcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4uL2F1dGguanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGhvbWVQYWdlIHtcclxuXHJcbiAgICAvLyBzaW5nbGV0b25cclxuICAgIHN0YXRpYyBfY3VycmVudDtcclxuXHJcbiAgICAvKiogQHJldHVybnMge2hvbWVQYWdlfSAqL1xyXG4gICAgc3RhdGljIGdldCBjdXJyZW50KCkge1xyXG4gICAgICAgIGlmICghaG9tZVBhZ2UuX2N1cnJlbnQpXHJcbiAgICAgICAgICAgIGhvbWVQYWdlLl9jdXJyZW50ID0gbmV3IGhvbWVQYWdlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBob21lUGFnZS5fY3VycmVudDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICAkKGFzeW5jICgpID0+IGF3YWl0IHRoaXMub25Mb2FkKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IGF3YWl0IGNvbnNvbGUubG9nKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZywgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG4gICAgICAgIC8vIHdoZW4gcmVjZWl2aW5nIGFuIG9yZGVyIHRvIHJlZnJlc2ggbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKCdyZWZyZXNoX25vdGlmaWNhdGlvbnMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbCB0byByZWZyZXNoX25vdGlmaWNhdGlvbnNcIik7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGF1dGguY3VycmVudC5pc0F1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwic2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGgtbGFyZ2VcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFib3V0ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlNvbWV0aGluZyBpbnRlcmVzdGluZyBsaWtlLi4uIEhleSwgdGhpcyBpcyBhIHBpZWNlIG9mIE9TUyBwcm9qZWN0LCBtYWRlIGJ5IFNlYmFzdGllbiBQZXJ0dXM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY29nc1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdCBFbmdpbmUgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPiAgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cIm10LTJcIiBkYXRhLXN0eWxlPVwiYnRuLW91dGxpbmUtZGFya1wiIGRhdGEtY29udGFpbmVyPVwiYm9keVwiIGRhdGEtbGl2ZS1zZWFyY2g9XCJ0cnVlXCIgdGl0bGU9XCJDaG9vc2UgZGVmYXVsdCBlbmdpbmVcIiBpZD1cImRlZmF1bHRFbmdpbmVTZWxlY3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5NdXN0YXJkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+S2V0Y2h1cDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlJlbGlzaDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgYCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjZGVmYXVsdEVuZ2luZVNlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIG5vdGlmaWNhdGlvbiBtb2RhbFxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbCA9IG5ldyBtb2RhbFBhbmVsKFwibm90aWZcIikuc20oKTtcclxuXHJcbiAgICAgICAgLy8gYXV0byBiaW5kIHdpdGggYXJyb3cgZnVuY3Rpb25cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwub25TaG93bihlID0+IHRoaXMuc2hvd25QYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgLy8gbWFudWFsIGJpbmRpbmcgZm9yIGZ1blxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5vblNob3codGhpcy5zaG93UGFuZWwuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbCA9IG5ldyBtb2RhbFBhbmVsKFwic2V0dGluZ3NcIikubGcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLm9uU2hvd24oZSA9PiB0aGlzLnNob3duU2V0dGluZ3NQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRTZXR0aW5nc1BhbmVsKGUpKTtcclxuXHJcblxyXG4gICAgICAgIGF1dGguY3VycmVudC5vbihhdXRoLk9uQXV0aGVudGljYXRlZCwgYXN5bmMgaXNBdXRoID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzQXV0aClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBkaXNtaXNzTm90aWZpY2F0aW9uc0FzeW5jKCkge1xyXG5cclxuICAgICAgICAvLyBsb2FkaW5nIG5vdGlmaWNhdGlvbnNcclxuICAgICAgICBsZXQgdXJsID0gXCIvYXBpL25vdGlmaWNhdGlvbnNcIjtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbWV0aG9kOiBcIkRFTEVURVwiIH0pO1xyXG5cclxuICAgICAgICB2YXIgZGVsZXRlZCA9IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFkZWxldGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoTm90aWZpY2F0aW9uc0FzeW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpIHtcclxuXHJcbiAgICAgICAgLy8gbG9hZGluZyBub3RpZmljYXRpb25zXHJcbiAgICAgICAgbGV0IHVybCA9IFwiL2FwaS9ub3RpZmljYXRpb25zXCI7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGxldCBiZWxsQ29udGVudCA9ICQoJyNub3RpZi1iZWxsLWNvbnRlbnQnKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm5vdGlmaWNhdGlvbnMgfHwgdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA8PSAwKSB7XHJcblxyXG4gICAgICAgICAgICBiZWxsQ29udGVudC5oaWRlKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtYmVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eS1tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5ObyBuZXcgbm90aWZpY2F0aW9ucywgeWV0Ljwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBiZWxsQ29udGVudC5zaG93KCk7XHJcbiAgICAgICAgICAgIGJlbGxDb250ZW50LnRleHQodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5vdGlmIG9mIHRoaXMubm90aWZpY2F0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBub3RpZlVybCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vdGlmLnVybClcclxuICAgICAgICAgICAgICAgICAgICBub3RpZlVybCA9IGA8YSBocmVmPVwiJHtub3RpZi51cmx9XCIgY2xhc3M9XCJtbC0yIGhpZGUtc21cIj48aSBjbGFzcz1cImZhcyBmYS1leHRlcm5hbC1saW5rLWFsdFwiPjwvaT48L2E+YDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmFwcGVuZChgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2stY2lyY2xlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtub3RpZi50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtub3RpZi5tZXNzYWdlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bm90aWZVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2ID5cclxuICAgICAgICAgICAgICAgICAgICA8L2RpdiA+IGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcbiAgICAgICAgdmFyIHR5cGUgPSBidXR0b24uZGF0YSgndHlwZScpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3duU2V0dGluZ3NQYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRTZXR0aW5nc1BhbmVsKGV2ZW50KSB7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuZGVsZXRlQnV0dG9uVGV4dChcIkRpc21pc3Mgbm90aWZpY2F0aW9uc1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCFhdXRoLmN1cnJlbnQuaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuYXBwZW5kKGBcclxuICAgICAgICAgICAgICAgICAgICA8IGRpdiBjbGFzcz0gXCJub3RpZi1lbXB0eVwiID5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhciBmYS1iZWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eS1tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlBsZWFzZSBsb2cgaW4gdG8gc2VlIG5vdGlmaWNhdGlvbnMgaGVyZS48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXYgPiBgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5kZWxldGVCdXR0b24oKS5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRpc21pc3NOb3RpZmljYXRpb25zQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBzZXR0aW5nc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu79leHBvcnQgZnVuY3Rpb24gc2V0RW5naW5lQm9vdHN0cmFwVGFibGUoJGVuZ2luZXNUYWJsZSwgdXJsLCBjaGVja2VkLCBvblBvc3RCb2R5LCBvbkNoZWNrUm93KSB7XHJcblxyXG5cclxuICAgIGxldCBvbkNoZWNrID0gY2hlY2tlZCA/IG9uQ2hlY2tSb3cgOiAoKSA9PiB7IH07XHJcbiAgICBsZXQgb25DbGljayA9IGNoZWNrZWQgPyAoKSA9PiB7IH06IG9uQ2hlY2tSb3c7XHJcblxyXG4gICAgbGV0IGNvbHVtbnMgPSBbXTtcclxuICAgIGlmIChjaGVja2VkKVxyXG4gICAgICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgICAgIGZpZWxkOiAnZW5naW5lSWQnLFxyXG4gICAgICAgICAgICByYWRpbzogdHJ1ZSxcclxuICAgICAgICB9KVxyXG5cclxuICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgZmllbGQ6ICdlbmdpbmVUeXBlSnNvbicsXHJcbiAgICAgICAgdGl0bGU6ICdUeXBlJyxcclxuICAgICAgICB3aWR0aDogJzgwJyxcclxuICAgICAgICBhbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgc2VhcmNoRm9ybWF0dGVyOiBmYWxzZSxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz0nc3ZnLTIyeDIyLWljb24nPjxkaXYgY2xhc3M9J3N2Zy1pY29uICR7dmFsdWUuZW5naW5lVHlwZUljb25TdHJpbmd9Jz48L2Rpdj48L2Rpdj5gO1xyXG4gICAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAgICBmaWVsZDogJ3N0YXR1c0pzb24nLFxyXG4gICAgICAgIHRpdGxlOiAnU3RhdHVzJyxcclxuICAgICAgICB3aWR0aDogJzgwJyxcclxuICAgICAgICBhbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgc2VhcmNoRm9ybWF0dGVyOiBmYWxzZSxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGkgY2xhc3M9XCIke3ZhbHVlLnN0YXR1c0ljb259XCIgdGl0bGU9JyR7dmFsdWUuc3RhdHVzU3RyaW5nfScgc3R5bGU9XCJjb2xvcjoke3ZhbHVlLnN0YXR1c0NvbG9yfTt3aWR0aDoyMHB4O1wiPjwvaT5gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCB7XHJcbiAgICAgICAgZmllbGQ6ICdlbmdpbmVOYW1lJyxcclxuICAgICAgICB0aXRsZTogJ05hbWUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCByb3cpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGA8c3Ryb25nPiR7dmFsdWV9PC9zdHJvbmc+YDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBzZWFyY2g6IGZhbHNlLFxyXG4gICAgICAgIHNob3dSZWZyZXNoOiBmYWxzZSxcclxuICAgICAgICBzaG93VG9nZ2xlOiBmYWxzZSxcclxuICAgICAgICBjaGVja2JveEhlYWRlcjogZmFsc2UsXHJcbiAgICAgICAgY2xpY2tUb1NlbGVjdDogdHJ1ZSxcclxuICAgICAgICBwYWdpbmF0aW9uOiBmYWxzZSxcclxuICAgICAgICByZXNpemFibGU6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZ1RlbXBsYXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAnPGkgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtZncgZmEtMnhcIj48L2k+JztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgb25Qb3N0Qm9keTogb25Qb3N0Qm9keSxcclxuICAgICAgICBvbkNoZWNrOiBvbkNoZWNrLFxyXG4gICAgICAgIG9uQ2xpY2tSb3c6IG9uQ2xpY2ssXHJcbiAgICAgICAgZm9ybWF0Tm9NYXRjaGVzOiAoKSA9PiB7IHJldHVybiBcIllvdSBkb24ndCBoYXZlIGFueSBydW5uaW5nIGVuZ2luZS4gUGxlYXNlIDxhIGhyZWY9Jy9FbmdpbmVzL0luZGV4Jz5jaGVjayB5b3VyIGVuZ2luZXMgc3RhdHVzLjwvYT4gXCI7IH1cclxuICAgIH0pO1xyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSB9IGZyb20gXCIuLi9ib290c3RyYXBUYWJsZXMvaW5kZXguanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlc1BhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIGdldCB0YWJsZVxyXG4gICAgICAgIHRoaXMuZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBlbmdpbmUgdGFibGVcclxuICAgICAgICB0aGlzLiRlbmdpbmVzVGFibGUgPSAkKFwiI2VuZ2luZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUodGhpcy4kZW5naW5lc1RhYmxlLCBcIi9kYXRhU291cmNlcy9pbmRleC9lbmdpbmVzXCIsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLm9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3cpID0+IHRoaXMub25DbGlja1Jvdyhyb3cpKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlID0gJChcIiNkYXRhU291cmNlc1RhYmxlXCIpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gJ1BsZWFzZSBzZWxlY3QgYSBydW5uaW5nIGVuZ2luZSB0byBzZWUgYWxsIGRhdGEgc291cmNlcyBhdmFpbGFibGUuJzsgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUub24oJ2NsaWNrLXJvdy5icy50YWJsZScsIChyb3csICRlbGVtZW50LCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvRGF0YVNvdXJjZXMvRWRpdC8ke3RoaXMuZW5naW5lLmlkfS8keyRlbGVtZW50Lm5hbWV9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblBvc3RCb2R5KGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsaWNrUm93KHJvdykge1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZSA9IHJvdztcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWREYXRhU291cmNlc0FzeW5jKHRoaXMuZW5naW5lKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgbG9hZERhdGFTb3VyY2VzQXN5bmMoZW5naW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnc2hvd0xvYWRpbmcnKTtcclxuICAgICAgICBsZXQgZGF0YV91cmwgPSBgL2RhdGFTb3VyY2VzL2luZGV4L2RhdGFTb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lLmlkfWA7XHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChkYXRhX3VybCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlcyA9IGF3YWl0IGRhdGFTb3VyY2VzUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZGF0YVNvdXJjZXMpXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCd1cGRhdGVGb3JtYXRUZXh0JywgJ2Zvcm1hdE5vTWF0Y2hlcycsXHJcbiAgICAgICAgICAgIGBObyBkYXRhIHNvdXJjZXMgZm9yIGVuZ2luZSA8c3Ryb25nPiR7ZW5naW5lLmVuZ2luZU5hbWV9PC9zdHJvbmc+LiA8YSBocmVmPScvZGF0YVNvdXJjZXMvbmV3Jz5DcmVhdGUgYSBuZXcgZGF0YSBzb3VyY2U8L2E+IGZvciB5b3VyIGVuZ2luZWApO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2xvYWQnLCB0aGlzLmRhdGFTb3VyY2VzKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdoaWRlTG9hZGluZycpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3Mgd2l6YXJkUGFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaHRtbEZpZWxkUHJlZml4LCBlbmdpbmVVcmwpIHtcclxuXHJcbiAgICAgICAgLy8gSHRtbEZpZWxkUHJlZml4IHByZWZpeCBpcyB0aGUgcHJlZGl4IGZvciByZW5kZXJpbmcgYXNwLm5ldCBjb3JlIGl0ZW1zXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBgJHtodG1sRmllbGRQcmVmaXh9X2A7XHJcblxyXG4gICAgICAgIC8vIHVybCBmb3IgbG9hZGluZyBlbmdpbmVzXHJcbiAgICAgICAgdGhpcy5lbmdpbmVVcmwgPSBlbmdpbmVVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYWRNZXRob2QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRNZXRob2Q7XHJcbiAgICB9XHJcbiAgICBzZXQgbG9hZE1ldGhvZCh4KSB7XHJcbiAgICAgICAgdGhpcy5fbG9hZE1ldGhvZCA9IHg7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGdldCBmb3JtXHJcbiAgICAgICAgdGhpcy4kZm9ybSA9ICQoXCJmb3JtXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgZW5naW5lIHRhYmxlXHJcbiAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBzcGlubmVyXHJcbiAgICAgICAgdGhpcy4kc3Bpbm5lciA9ICQoXCIjc3Bpbm5lclwiKVxyXG5cclxuICAgICAgICAvLyBnZXQgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuJG5leHRCdXR0b24gPSAkKFwiI25leHRCdXR0b25cIik7XHJcbiAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24gPSAkKFwiI3ByZXZpb3VzQnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuJHNhdmVCdXR0b24gPSAkKFwiI3NhdmVCdXR0b25cIik7XHJcblxyXG4gICAgICAgIC8vIGdldCB3aXphcmRcclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZCA9ICQoXCIjc21hcnRXaXphcmRcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBwcm9wZXJ0aWVzIHBhbmVsXHJcbiAgICAgICAgdGhpcy4kcHJvcGVydGllcyA9ICQoXCIjcHJvcGVydGllc1wiKTtcclxuXHJcbiAgICAgICAgLy8gaGlkZGVuIGZpZWxkc1xyXG4gICAgICAgIHRoaXMuJGVuZ2luZUlkRWxlbWVudCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fUVuZ2luZUlkYCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZE1ldGhvZCA9ICdHRVQnO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50LnZhbCgpKVxyXG4gICAgICAgICAgICB0aGlzLmxvYWRNZXRob2QgPSAnUE9TVCc7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRzcGlubmVyKVxyXG4gICAgICAgICAgICB0aGlzLiRzcGlubmVyLmhpZGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib29zdHJhcEVuZ2luZXNUYWJsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmJvb3RzdHJhcFdpemFyZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmJvb3RzdHJhcEJ1dHRvbnMoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYm9vdHN0cmFwV2l6YXJkKCkge1xyXG5cclxuICAgICAgICAvLyBTdGVwIHNob3cgZXZlbnRcclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInNob3dTdGVwXCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24sIHN0ZXBQb3NpdGlvbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJHNhdmVCdXR0b24uZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gXCJmaXJzdFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcImxhc3RcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzYXZlQnV0dG9uLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgc3RlcCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxvYWRNZXRob2QgPT0gJ1BPU1QnKVxyXG4gICAgICAgICAgICBzdGVwID0gMjtcclxuXHJcbiAgICAgICAgLy8gYm9vdHN0cmFwIHdpemFyZFxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHN0ZXAsXHJcbiAgICAgICAgICAgIHRoZW1lOiAnZG90cycsIC8vIHRoZW1lIGZvciB0aGUgd2l6YXJkLCByZWxhdGVkIGNzcyBuZWVkIHRvIGluY2x1ZGUgZm9yIG90aGVyIHRoYW4gZGVmYXVsdCB0aGVtZVxyXG4gICAgICAgICAgICBhdXRvQWRqdXN0SGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnZmFkZScsIC8vIEVmZmVjdCBvbiBuYXZpZ2F0aW9uLCBub25lL2ZhZGUvc2xpZGUtaG9yaXpvbnRhbC9zbGlkZS12ZXJ0aWNhbC9zbGlkZS1zd2luZ1xyXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICcyMDAnLCAvLyBUcmFuc2lvbiBhbmltYXRpb24gc3BlZWRcclxuICAgICAgICAgICAgICAgIGVhc2luZzogJycgLy8gVHJhbnNpdGlvbiBhbmltYXRpb24gZWFzaW5nLiBOb3Qgc3VwcG9ydGVkIHdpdGhvdXQgYSBqUXVlcnkgZWFzaW5nIHBsdWdpblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbmFibGVVUkxoYXNoOiBmYWxzZSxcclxuICAgICAgICAgICAgdG9vbGJhclNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICB0b29sYmFyUG9zaXRpb246ICdub25lJywgLy8gbm9uZSwgdG9wLCBib3R0b20sIGJvdGhcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25Qb3NpdGlvbjogJ3JpZ2h0JywgLy8gbGVmdCwgcmlnaHQsIGNlbnRlclxyXG4gICAgICAgICAgICAgICAgc2hvd05leHRCdXR0b246IGZhbHNlLCAvLyBzaG93L2hpZGUgYSBOZXh0IGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgc2hvd1ByZXZpb3VzQnV0dG9uOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGEgUHJldmlvdXMgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyRXh0cmFCdXR0b25zOiBbXSAvLyBFeHRyYSBidXR0b25zIHRvIHNob3cgb24gdG9vbGJhciwgYXJyYXkgb2YgalF1ZXJ5IGlucHV0L2J1dHRvbnMgZWxlbWVudHNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAga2V5Ym9hcmRTZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAga2V5TmF2aWdhdGlvbjogZmFsc2UsIC8vIEVuYWJsZS9EaXNhYmxlIGtleWJvYXJkIG5hdmlnYXRpb24obGVmdCBhbmQgcmlnaHQga2V5cyBhcmUgdXNlZCBpZiBlbmFibGVkKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgZW5naW5lVGFibGVPbkNoZWNrUm93KHJvdywgJGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKHJvdy5pZCk7XHJcblxyXG4gICAgfVxyXG4gICAgYXN5bmMgZW5naW5lVGFibGVPblBvc3RCb2R5KGRhdGEpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhPy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE9uIFBvc3RCYWNrLCBzZWxlY3QgdGhlIGNvcnJlY3QgZW5naW5lXHJcbiAgICAgICAgaWYgKHRoaXMubG9hZE1ldGhvZCA9PT0gJ1BPU1QnKVxyXG4gICAgICAgICAgICB0aGlzLiRlbmdpbmVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2NoZWNrJywgZGF0YS5maW5kSW5kZXgoZSA9PiBlLmlkID09PSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpKTtcclxuXHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgcmFkaW8gaW5wdXRzIGJ1dHRvbnMgdG8gYWRkIGEgdmFsaWRhdGlvbiBydWxlIG9uIHRoZW1cclxuICAgICAgICBsZXQgJGJ0U2VsZWN0SXRlbSA9ICQoJ2lucHV0W25hbWU9XCJidFNlbGVjdEl0ZW1cIl0nKTtcclxuXHJcbiAgICAgICAgJGJ0U2VsZWN0SXRlbS5ydWxlcyhcImFkZFwiLCB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwiWW91IHNob3VsZCBzZWxlY3QgYW4gZW5naW5lIGJlZm9yZSBnb2luZyBuZXh0IHN0ZXAuXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYm9vc3RyYXBFbmdpbmVzVGFibGUoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZW5naW5lc1RhYmxlIHx8ICF0aGlzLmVuZ2luZVVybClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsIHRoaXMuZW5naW5lVXJsLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5lbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3csICRlbGVtZW50KSA9PiB0aGlzLmVuZ2luZVRhYmxlT25DaGVja1Jvdyhyb3csICRlbGVtZW50KSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJvb3RzdHJhcEJ1dHRvbnMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRwcmV2aW91c0J1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwicHJldlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRuZXh0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRm9ybSgpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcIm5leHRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YWxpZGF0ZUZvcm0oKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZm9ybSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gdGhpcy4kZm9ybS52YWxpZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWlzVmFsaWQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbGlkYXRvciA9IHRoaXMuJGZvcm0udmFsaWRhdGUoKTtcclxuICAgICAgICB2YWxpZGF0b3IucmVzZXRGb3JtKCk7XHJcblxyXG4gICAgICAgIGxldCBzdW1tYXJ5ID0gdGhpcy4kZm9ybS5maW5kKFwiLnZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIik7XHJcblxyXG4gICAgICAgIGlmIChzdW1tYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gc3VtbWFyeS5maW5kKFwidWxcIik7XHJcbiAgICAgICAgICAgIGlmIChsaXN0KVxyXG4gICAgICAgICAgICAgICAgbGlzdC5lbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVTcWwge1xyXG5cclxuXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoZW5naW5lSWQsIGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCwgbG9hZE1ldGhvZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcblxyXG4gICAgICAgIGlmIChsb2FkTWV0aG9kICE9PSAnUE9TVCcpIHtcclxuICAgICAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9kYXRhU291cmNlcy9uZXcvcHJvcGVydGllcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkdnQ9QXp1cmVTcWxEYXRhYmFzZWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9pZiAobG9hZE1ldGhvZCAhPT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIge1xyXG5cclxuXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoZW5naW5lSWQsIGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCwgbG9hZE1ldGhvZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgaWYgKGxvYWRNZXRob2QgIT09ICdQT1NUJykge1xyXG4gICAgICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2RhdGFTb3VyY2VzL25ldy9wcm9wZXJ0aWVzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmR2dD1BenVyZUJsb2JGU2ApO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGlmIChsb2FkTWV0aG9kICE9PSAnUE9TVCcpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIu+7v2V4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVDb3Ntb3NEYiB7XHJcblxyXG5cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50LCBsb2FkTWV0aG9kKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBpZiAobG9hZE1ldGhvZCAhPT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUNvc21vc0RiYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobG9hZE1ldGhvZCAhPT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHdpemFyZFBhZ2UgfSBmcm9tICcuLi93aXphcmQvaW5kZXguanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVTcWwgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZVNxbC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVDb3Ntb3NEYiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VOZXcgZXh0ZW5kcyB3aXphcmRQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcignRGF0YVNvdXJjZVZpZXcnLCAnL2RhdGFTb3VyY2VzL25ldy9lbmdpbmVzJylcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwgPSBuZXcgZGF0YVNvdXJjZUF6dXJlU3FsKCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyID0gbmV3IGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIoKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZUNvc21vc0RiID0gbmV3IGRhdGFTb3VyY2VBenVyZUNvc21vc0RiKCk7XHJcbiAgICAgICAgdGhpcy5sYXN0VHlwZVNlbGVjdGVkID0gJyc7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvLyBjYWxsIGJhc2Ugb25Mb2FkIG1ldGhvZFxyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQub24oXCJzdGVwQ29udGVudFwiLCBhc3luYyAoZSwgYW5jaG9yT2JqZWN0LCBzdGVwTnVtYmVyLCBzdGVwRGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09IDIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGlubmVyPy5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZW5naW5lSWQ/Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHNlbGVjdGlvbiBmcm9tIGRhdGEgc291cmNlcyB0eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJChgaW5wdXRbbmFtZT1cIkRhdGFTb3VyY2VWaWV3LkRhdGFTb3VyY2VUeXBlXCJdOmNoZWNrZWRgKS52YWwoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9PT0gdHlwZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9IHR5cGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2F6dXJlc3FsZGF0YWJhc2UnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcywgdGhpcy5sb2FkTWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnYXp1cmVzcWxkdycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZVNxbC5sb2FkQXN5bmMoZW5naW5lSWQsIHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzLCB0aGlzLmxvYWRNZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZWJsb2JmcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcywgdGhpcy5sb2FkTWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnY29zbW9zZGInKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhU291cmNlQXp1cmVDb3Ntb3NEYi5sb2FkQXN5bmMoZW5naW5lSWQsIHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzLCB0aGlzLmxvYWRNZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXI/LmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIEdldHRpbmcgdGVzdCBidXR0b25cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbiA9ICQoXCIjZGF0YVNvdXJjZVRlc3RCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmNsaWNrKGFzeW5jIChldnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSAkKFwiI0RhdGFTb3VyY2VWaWV3X0VuZ2luZUlkXCIpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke2VuZ2luZUlkfS90ZXN0YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvL2FzeW5jIHRlc3RDb25uZWN0aW9uQXN5bmMoZXZ0KSB7XHJcblxyXG4gICAgLy8gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgLy8gICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi50ZXh0KFwiXCIpO1xyXG4gICAgLy8gICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5yZW1vdmVDbGFzcygpO1xyXG5cclxuICAgIC8vICAgIHRoaXMuYnRuVGVzdENvbm5lY3Rpb24uZGlzYWJsZSgpO1xyXG5cclxuICAgIC8vICAgIC8vIHVybCBmb3IgdGhhdCBwYXJ0aWN1bGFyIGRlcGxveW1lbnRcclxuICAgIC8vICAgIGxldCB1cmwgPSBgL2FwaS9kYXRhU291cmNlcy9zcWxjb25uZWN0aW9uL3Rlc3RgO1xyXG5cclxuICAgIC8vICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG4gICAgLy8gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgLy8gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgY29ubmVjdGlvbjogdGhpcy5jb25uZWN0aW9uU3RyaW5nLnZhbCgpIH0pLFxyXG4gICAgLy8gICAgICAgIGhlYWRlcnM6IHtcclxuICAgIC8vICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcclxuICAgIC8vICAgICAgICB9XHJcbiAgICAvLyAgICB9KTtcclxuXHJcbiAgICAvLyAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgLy8gICAgICAgIHZhciBlcnJvckpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgIC8vICAgICAgICBhd2FpdCB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnRleHQoZXJyb3JKc29uLmVycm9yKVxyXG4gICAgLy8gICAgfVxyXG5cclxuICAgIC8vICAgIHZhciByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgLy8gICAgaWYgKHJlc3VsdC5yZXN1bHQpIHtcclxuICAgIC8vICAgICAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLmFkZENsYXNzKFwidGV4dC1zdWNjZXNzIG1sLTJcIik7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5odG1sKFwiPGkgY2xhc3M9J2ZhcyBmYS1jaGVjay1jaXJjbGUnPjwvaT4gIENvbm5lY3Rpb24gc3VjY2Vzc2Z1bFwiKTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICAgIGVsc2Uge1xyXG4gICAgLy8gICAgICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24uYWRkQ2xhc3MoXCJ0ZXh0LWRhbmdlciBtbC0yXCIpO1xyXG4gICAgLy8gICAgICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24uaHRtbChcIjxpIGNsYXNzPSdmYXMgZmEtZXhjbGFtYXRpb24tY2lyY2xlJz48L2k+ICBDYW4ndCBjb25uZWN0IHRvIHRoZSBzb3VyY2UgdXNpbmcgdGhpcyBjb25uZWN0aW9uIHN0cmluZ1wiKTtcclxuICAgIC8vICAgIH1cclxuXHJcbiAgICAvLyAgICB0aGlzLmJ0blRlc3RDb25uZWN0aW9uLmVuYWJsZSgpO1xyXG4gICAgLy99XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgd2l6YXJkUGFnZSB9IGZyb20gJy4uL3dpemFyZC9pbmRleC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZVNxbCB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlU3FsLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMi5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZUNvc21vc0RiIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVDb3Ntb3NEYi5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgZGF0YVNvdXJjZUVkaXQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW5naW5lSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24udGVzdEFzeW5jKGAvYXBpL2RhdGFmYWN0b3JpZXMvJHt0aGlzLmVuZ2luZUlkfS90ZXN0YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kc291cmNlQ29kZSA9ICQoXCIjc291cmNlQ29kZVwiKTtcclxuXHJcbiAgICAgICAgbGV0IGpzb25PYmplY3RTdHJpbmcgPSAkKFwiI0RhdGFTb3VyY2VWaWV3X0pzb25TdHJpbmdcIikudmFsKCk7XHJcblxyXG4gICAgICAgIGlmIChqc29uT2JqZWN0U3RyaW5nICYmIGpzb25PYmplY3RTdHJpbmcubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbyA9IEpTT04ucGFyc2UoanNvbk9iamVjdFN0cmluZyk7XHJcbiAgICAgICAgICAgIGxldCBqc29uU3RyaW5nID0gUHJpc20uaGlnaGxpZ2h0KEpTT04uc3RyaW5naWZ5KG8sIG51bGwsIDIpLCBQcmlzbS5sYW5ndWFnZXMuanNvbiwgJ2pzb24nKTtcclxuXHJcbiAgICAgICAgICAgIGxldCAkc291cmNlQ29kZSA9ICQoXCIjc291cmNlQ29kZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkc291cmNlQ29kZSlcclxuICAgICAgICAgICAgICAgICRzb3VyY2VDb2RlLmh0bWwoanNvblN0cmluZyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlIH0gZnJvbSBcIi4uL2Jvb3RzdHJhcFRhYmxlcy9pbmRleC5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzUGFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uUG9zdEJvZHkoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZSA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25DbGlja1Jvdyhyb3cpIHtcclxuICAgICAgICB0aGlzLmVuZ2luZSA9IHJvdztcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRFbnRpdGllc0FzeW5jKHRoaXMuZW5naW5lKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBnZXQgdGFibGVcclxuICAgICAgICB0aGlzLiRlbmdpbmVzVGFibGUgPSAkKFwiI2VuZ2luZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLiRlbmdpbmVzVGFibGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUodGhpcy4kZW5naW5lc1RhYmxlLCAnL2VudGl0aWVzL2luZGV4L2VuZ2luZXMnLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5vblBvc3RCb2R5KGRhdGEpLFxyXG4gICAgICAgICAgICAocm93KSA9PiB0aGlzLm9uQ2xpY2tSb3cocm93KSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUgPSAkKFwiI2VudGl0aWVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICBmb3JtYXROb01hdGNoZXM6ICgpID0+IHsgcmV0dXJuICdQbGVhc2Ugc2VsZWN0IGEgcnVubmluZyBlbmdpbmUgdG8gc2VlIGFsbCB0aGUgZW50aXRpZXMuJzsgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLiRlbnRpdGllc1RhYmxlLm9uKCdjbGljay1yb3cuYnMudGFibGUnLCAocm93LCAkZWxlbWVudCwgZmllbGQpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgL0VudGl0aWVzL0VkaXQvJHt0aGlzLmVuZ2luZS5pZH0vJHskZWxlbWVudC5uYW1lfWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gXHJcblxyXG5cclxuICAgIGFzeW5jIGxvYWRFbnRpdGllc0FzeW5jKGVuZ2luZSkge1xyXG5cclxuICAgICAgICB0aGlzLiRlbnRpdGllc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdzaG93TG9hZGluZycpO1xyXG4gICAgICAgIGxldCBkYXRhX3VybCA9IGAvZW50aXRpZXMvaW5kZXgvZW50aXRpZXM/ZW5naW5lSWQ9JHtlbmdpbmUuaWR9YDtcclxuICAgICAgICBsZXQgZW50aXRpZXNSZXNwb25zZSA9IGF3YWl0IGZldGNoKGRhdGFfdXJsKTtcclxuICAgICAgICB0aGlzLmVudGl0aWVzID0gYXdhaXQgZW50aXRpZXNSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5lbnRpdGllcylcclxuICAgICAgICAgICAgdGhpcy5lbnRpdGllcyA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLiRlbnRpdGllc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCd1cGRhdGVGb3JtYXRUZXh0JywgJ2Zvcm1hdE5vTWF0Y2hlcycsXHJcbiAgICAgICAgICAgIGBObyBlbnRpdGllcyBmb3IgZW5naW5lIDxzdHJvbmc+JHtlbmdpbmUuZW5naW5lTmFtZX08L3N0cm9uZz4uIDxhIGhyZWY9Jy9lbnRpdGllcy9uZXcnPkNyZWF0ZSBhIG5ldyBlbnRpdHk8L2E+IGZvciB5b3VyIGVuZ2luZWApO1xyXG5cclxuICAgICAgICB0aGlzLiRlbnRpdGllc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdsb2FkJywgdGhpcy5lbnRpdGllcyk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2hpZGVMb2FkaW5nJyk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBlbnRpdGllc0F6dXJlU3FsIHtcclxuXHJcblx0LyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmdpbmVJZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxvYWRNZXRob2RcclxuICAgICAqL1xyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCwgZW5naW5lSWQsIGxvYWRNZXRob2QpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGlmIChsb2FkTWV0aG9kICE9PSAnUE9TVCcpIHtcclxuICAgICAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PUF6dXJlU3FsVGFibGUmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCBlcnJvcnMgbGFiZWxzXHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzID0gJChcIiNsYWJlbEVycm9yRGF0YVNvdXJjZXNcIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcyA9ICQoXCIjbGFiZWxFcnJvclRhYmxlc1wiKTtcclxuXHJcbiAgICAgICAgLy8gb25jZSBsb2FkZWQsIGdldCB0aGUgc2VsZWN0b3JzXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZWApO1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZXNJdGVtc1N0cmluZ2ApO1xyXG4gICAgICAgIC8vIG9uIGRhdGEgc291cmNlcyBjaGFuZ2VzLCByZWZyZXNoIHRoZSB0YWJsZXNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5jaGFuZ2UoYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLnJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCkgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlTmFtZWApO1xyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZyA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlc0l0ZW1zU3RyaW5nYCk7XHJcbiAgICAgICAgLy8gb24gdGFibGUgY2hhbmdlLCBzZXQgdGhlIGNvcnJlY3QgYXR0cmlidXRlcyBmb3IgdGhlIHByZXZpZXcgYnV0dG9uXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmNoYW5nZSgoKSA9PiB7IHRoaXMuc2V0UHJldmlld0RhdGFBdHRyaWJ1dGVzKGVuZ2luZUlkKSB9KTtcclxuXHJcbiAgICAgICAgaWYgKGxvYWRNZXRob2QgIT09ICdQT1NUJykge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hEYXRhU291cmNlc0FzeW5jKGVuZ2luZUlkKSB7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZGlzYWJsZVBpY2tlcihcIkxvYWRpbmcgRGF0YSBTb3VyY2VzIC4uLlwiKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yVGFibGVzLmVtcHR5KCk7XHJcblxyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXNVcmwgPSBgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZVNxbERhdGFiYXNlYDtcclxuICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGRhdGFTb3VyY2VzVXJsKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGF3YWl0IHIuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoci5zdGF0dXMgIT0gNDAwKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzID0gZGF0YVNvdXJjZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YVNvdXJjZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLCB0ZXh0OiBpdGVtIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiTm8gRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoZGF0YVNvdXJjZXMuam9pbigpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YVNvdXJjZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJsb2FkaW5nIHRhYmxlcyAuLi5cIik7XHJcblxyXG4gICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgbGV0IHRhYmxlcyA9IFtdO1xyXG5cclxuICAgICAgICBsZXQgdGFibGVzVXJsID0gYC9hcGkvQXp1cmVTcWxEYXRhYmFzZS8ke2VuZ2luZUlkfS8ke2RhdGFTb3VyY2VTZWxlY3RlZH0vdGFibGVzYDtcclxuICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKHRhYmxlc1VybCk7XHJcblxyXG4gICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy50ZXh0KHRleHQuZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyLnN0YXR1cyAhPSA0MDApIHtcclxuICAgICAgICAgICAgbGV0IHRhYmxlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIHRhYmxlcyA9IHRhYmxlc0pzb24ubWFwKGl0ZW0gPT4gYCR7aXRlbS5zY2hlbWFOYW1lfS4ke2l0ZW0udGFibGVOYW1lfWApO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKHRhYmxlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLCB0ZXh0OiBpdGVtIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGFibGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBUYWJsZXMuLi5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0U3RyaW5nLnZhbCh0YWJsZXMuam9pbigpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIHRhYmxlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgIGlmICh0YWJsZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICB0aGlzLnNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlU2VsZWN0ZWQ/Lmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdGFibGVTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YWJsZVNlbGVjdGVkPy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIHRhYmxlVGFiID0gdGFibGVTZWxlY3RlZC5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgdmFyIHNjaGVtYU5hbWUgPSB0YWJsZVRhYlswXTtcclxuICAgICAgICB2YXIgdGFibGVOYW1lID0gdGFibGVUYWJbMV07XHJcblxyXG4gICAgICAgIC8vIGJlZm9yZSByZWZyZXNoaW5nIGNvbHVtbnMsIGFkZCBkYXRhIHRvIHByZXZpZXcgYnV0dG9uc1xyXG4gICAgICAgIGxldCAkcHJldmlld0VudGl0eUJ1dHRvbiA9ICQoXCIjcHJldmlld0VudGl0eUJ1dHRvblwiKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZW5naW5lLWlkXCIsIGVuZ2luZUlkKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZGF0YS1zb3VyY2UtbmFtZVwiLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJzY2hlbWEtbmFtZVwiLCBzY2hlbWFOYW1lKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwidGFibGUtbmFtZVwiLCB0YWJsZU5hbWUpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJ0aXRsZVwiLCBgVGFibGUgcHJldmlldyBbJHtzY2hlbWFOYW1lfV0uWyR7dGFibGVOYW1lfV1gKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzRGVsaW1pdGVkVGV4dCB7XHJcblxyXG5cdC8qKlxyXG4gICAgICogQHBhcmFtIHtKUXVlcnk8SFRNTEVsZW1lbnQ+fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5naW5lSWRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2FkTWV0aG9kXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRBc3luYyhodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQsIGVuZ2luZUlkLCBsb2FkTWV0aG9kKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBpZiAobG9hZE1ldGhvZCAhPT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZW50aXRpZXMvbmV3L2VudGl0aWVzP2R2dD1EZWxpbWl0ZWRUZXh0JmVuZ2luZUlkPSR7ZW5naW5lSWR9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gYWxsIHNlbGVjdCBwaWNrZXIgaW50byBzZWxlY3RwaWNrZXJcclxuICAgICAgICAkKCdzZWxlY3QnKS5zZWxlY3RwaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzID0gJChcIiNsYWJlbEVycm9yRGF0YVNvdXJjZXNcIik7XHJcblxyXG4gICAgICAgIC8vIG9uY2UgbG9hZGVkLCBnZXQgdGhlIHNlbGVjdG9yc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWVgKTtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZyA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VzSXRlbXNTdHJpbmdgKTtcclxuXHJcbiAgICAgICAgaWYgKGxvYWRNZXRob2QgIT09ICdQT1NUJykge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJMb2FkaW5nIERhdGEgU291cmNlcyAuLi5cIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLmVtcHR5KCk7XHJcblxyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXNVcmwgPSBgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZVNxbERhdGFiYXNlYDtcclxuICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGRhdGFTb3VyY2VzVXJsKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGF3YWl0IHIuanNvbigpO1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoci5zdGF0dXMgIT0gNDAwKSB7XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzID0gZGF0YVNvdXJjZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YVNvdXJjZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLCB0ZXh0OiBpdGVtIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiTm8gRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoZGF0YVNvdXJjZXMuam9pbigpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbFByZXZpZXcgfSBmcm9tIFwiLi4vbW9kYWwvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgZW50aXRpZXNBenVyZVNxbCB9IGZyb20gXCIuL2VudGl0aWVzQXp1cmVTcWwuanNcIjtcclxuaW1wb3J0IHsgZW50aXRpZXNEZWxpbWl0ZWRUZXh0IH0gZnJvbSBcIi4vZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmpzXCI7XHJcbmltcG9ydCB7IHdpemFyZFBhZ2UgfSBmcm9tICcuLi93aXphcmQvaW5kZXguanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzTmV3UGFnZSBleHRlbmRzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCdFbnRpdHlWaWV3JywgJy9lbnRpdGllcy9uZXcvZW5naW5lcycpO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzQXp1cmVTcWwgPSBuZXcgZW50aXRpZXNBenVyZVNxbCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXNEZWxpbWl0ZWRUZXh0ID0gbmV3IGVudGl0aWVzRGVsaW1pdGVkVGV4dCgpO1xyXG4gICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9ICcnO1xyXG59XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBvbkxvYWQgbWV0aG9kXHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcblxyXG4gICAgICAgIC8vIGluaXQgcHJldmlldyBwYW5lbFxyXG4gICAgICAgIG1vZGFsUGFuZWxQcmV2aWV3LmluaXRpYWxpemUoXCJwYW5lbFByZXZpZXdcIik7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBhbGwgc2VsZWN0IHBpY2tlciBpbnRvIHNlbGVjdHBpY2tlclxyXG4gICAgICAgICQoJ3NlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInN0ZXBDb250ZW50XCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09IDIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9IHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbmdpbmVJZD8ubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKGBpbnB1dFtuYW1lPVwiRW50aXR5Vmlldy5FbnRpdHlUeXBlXCJdOmNoZWNrZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPT09IHR5cGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSB0eXBlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ0F6dXJlU3FsVGFibGUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbnRpdGllc0F6dXJlU3FsLmxvYWRBc3luYyh0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcywgZW5naW5lSWQsIHRoaXMubG9hZE1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSAnRGVsaW1pdGVkVGV4dCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVudGl0aWVzRGVsaW1pdGVkVGV4dC5sb2FkQXN5bmModGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMsIGVuZ2luZUlkLCB0aGlzLmxvYWRNZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmxldCBqcXVlcnlFeHRlbmRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIGV4dGVuZCBwaWNrZXJcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBkaXNhYmxlUGlja2VyOiBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1wdHkoKTtcclxuICAgICAgICAgICAgdGhpcy5hdHRyKFwiZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIG1zZyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGVuYWJsZVBpY2tlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gZXh0ZW5kIGVuYWJsZSBkaXNhYmxlIG9mIGJ1dHRvbnMgYW5kIGEgaHJlZlxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAvLyBleHRlbmQgbG9hZCBhc3luY1xyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGxvYWRBc3luYzogZnVuY3Rpb24gKGRhdGFfdXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQoZGF0YV91cmwsIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgdGVzdEFzeW5jOiBhc3luYyBmdW5jdGlvbiAodXJsKSB7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBidXR0b24gd2hpY2ggY2xpY2tlZCAhXHJcbiAgICAgICAgICAgIGxldCAkYnRuID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2QtZmxleCBhbGlnbi1pdGVtcy1iYXNlbGluZSB0ZXh0LW5vd3JhcCcpLmFkZENsYXNzKCdkLWZsZXggYWxpZ24taXRlbXMtYmFzZWxpbmUgdGV4dC1ub3dyYXAnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidG5JZCA9ICRidG4uYXR0cignaWQnKTtcclxuICAgICAgICAgICAgbGV0IHNwaW5uZXJJZCA9IGAke2J0bklkfVNwaW5uZXJgO1xyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZUlkID0gYCR7YnRuSWR9TWVzc2FnZWA7XHJcblxyXG4gICAgICAgICAgICBsZXQgJHNwaW5uZXJTcGFuID0gJChgIyR7c3Bpbm5lcklkfWApO1xyXG4gICAgICAgICAgICBsZXQgJG1lc3NhZ2VTcGFuID0gJChgIyR7bWVzc2FnZUlkfWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkc3Bpbm5lclNwYW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgJGJ0bi5hZnRlcihgPHNwYW4gaWQ9JHtzcGlubmVySWR9IHN0eWxlPVwiZGlzcGxheTpub25lO1wiIGNsYXNzPVwibWwtMlwiPjxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT48L3NwYW4+YCk7XHJcblxyXG4gICAgICAgICAgICAkc3Bpbm5lclNwYW4gPSAkKGAjJHtzcGlubmVySWR9YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRtZXNzYWdlU3Bhbi5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lclNwYW4uYWZ0ZXIoYDxzcGFuIGlkPSR7bWVzc2FnZUlkfSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIiBjbGFzcz1cIm1sLTJcIj48L3NwYW4+YCk7XHJcblxyXG4gICAgICAgICAgICAkbWVzc2FnZVNwYW4gPSAkKGAjJHttZXNzYWdlSWR9YCk7XHJcblxyXG4gICAgICAgICAgICAkbWVzc2FnZVNwYW4uaGlkZSgpO1xyXG4gICAgICAgICAgICAkc3Bpbm5lclNwYW4uc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCAkYnRuLnBvc3RBc3luYyh1cmwsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICRzcGlubmVyU3Bhbi5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5lcnJvcnMgfHwgciA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHIgJiYgci5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBPYmplY3QudmFsdWVzKHIuZXJyb3JzKS5mbGF0TWFwKGUgPT4gZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IFtcIkNhbid0IGNvbm5lY3RcIl07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBgPGkgY2xhc3M9XCJmYXMgZmEtZXhjbGFtYXRpb25cIj48L2k+ICR7ZXJyb3JzWzBdfWA7XHJcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICRtZXNzYWdlU3Bhbi5hZGRDbGFzcyhcInRleHQtZGFuZ2VyXCIpLnJlbW92ZUNsYXNzKFwidGV4dC1zdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+IGNvbm5lY3Rpb24gc3VjY2Vzc2Z1bCc7XHJcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICRtZXNzYWdlU3Bhbi5hZGRDbGFzcyhcInRleHQtc3VjY2Vzc1wiKS5yZW1vdmVDbGFzcyhcInRleHQtZGFuZ2VyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRtZXNzYWdlU3Bhbi5zaG93KCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIHBvc3RBc3luYzogYXN5bmMgZnVuY3Rpb24gKHVybCwgY2hlY2tJc1ZhbGlkKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoISQoXCJmb3JtXCIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNoZWNrSXNWYWxpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gTGF1bmNoIGEgdmFsaWRhdGlvbiBiZWZvcmVcclxuICAgICAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gJChcImZvcm1cIikudmFsaWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZm9ybVZhbHVlcyA9ICQoJ2Zvcm0nKS5zZXJpYWxpemVBcnJheSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvcm1kYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgICQuZWFjaChmb3JtVmFsdWVzLCBmdW5jdGlvbiAoaSwgdikge1xyXG4gICAgICAgICAgICAgICAgZm9ybWRhdGEuYXBwZW5kKHYubmFtZSwgdi52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuICAgICAgICAgICAgICAgICAgICBib2R5OiBmb3JtZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlSnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCB8fCByZXNwb25zZUpzb24gPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGVja0lzVmFsaWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKGRvY3VtZW50KS5maW5kKFwiW2RhdGEtdmFsbXNnLXN1bW1hcnk9dHJ1ZV1cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gY29udGFpbmVyLmZpbmQoXCJ1bFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZUpzb24gJiYgcmVzcG9uc2VKc29uLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gT2JqZWN0LnZhbHVlcyhyZXNwb25zZUpzb24uZXJyb3JzKS5mbGF0TWFwKGUgPT4gZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBbXCJDYW4ndCBjb25uZWN0XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdCAmJiBsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFkZENsYXNzKFwidmFsaWRhdGlvbi1zdW1tYXJ5LWVycm9yc1wiKS5yZW1vdmVDbGFzcyhcInZhbGlkYXRpb24tc3VtbWFyeS12YWxpZFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZXJyb3JzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIjxsaSAvPlwiKS5odG1sKHRoaXMpLmFwcGVuZFRvKGxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlSnNvbjtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyRXhjZXB0aW9uOiBbZV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcblxyXG5cclxuLy9hc3luYyBwb3N0QXN5bmMoKSB7XHJcbi8vICAgIC8vIEZpcnN0LCBzYXZlIHRoZSBkZXBsb3ltZW50LlxyXG5cclxuLy8gICAgbGV0IHRva2VuID0gJCgnaW5wdXRbbmFtZT1cIl9fUmVxdWVzdFZlcmlmaWNhdGlvblRva2VuXCJdJykudmFsKCk7XHJcblxyXG4vLyAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnJywge1xyXG4vLyAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbi8vICAgICAgICBib2R5OiBgZGF0YVNvdXJjZVZpZXcuRW5naW5lSWQ9JHt0aGlzLmRhdGFTb3VyY2VWaWV3LmVuZ2luZUlkfWAgK1xyXG4vLyAgICAgICAgICAgIGAmZGF0YVNvdXJjZVZpZXcuRGF0YVNvdXJjZVR5cGU9JHt0aGlzLmRhdGFTb3VyY2VWaWV3LmRhdGFTb3VyY2VUeXBlfWAgK1xyXG4vLyAgICAgICAgICAgIGAmZGF0YVNvdXJjZVZpZXcuQ29ubmVjdGlvblN0cmluZz0ke3RoaXMuZGF0YVNvdXJjZVZpZXcuY29ubmVjdGlvblN0cmluZ31gICtcclxuLy8gICAgICAgICAgICBgJl9fUmVxdWVzdFZlcmlmaWNhdGlvblRva2VuPSR7dG9rZW59YCxcclxuLy8gICAgICAgIGhlYWRlcnM6IHtcclxuLy8gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD11dGYtOFwiXHJcbi8vICAgICAgICB9XHJcbi8vICAgIH0pO1xyXG5cclxuLy99XHJcblxyXG5leHBvcnQgZGVmYXVsdCAoanF1ZXJ5RXh0ZW5kcykoKTsiLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi9yb3V0ZXIuanNcIjtcclxuaW1wb3J0IHsgZGFzaGJvYXJkUGFnZSB9IGZyb20gXCIuL2Rhc2hib2FyZC9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBlbmdpbmVzUGFnZSwgZW5naW5lRGV0YWlsc1BhZ2UgfSBmcm9tIFwiLi9lbmdpbmVzL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7IGFkbWluUGFnZSwgYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZSwgYWRtaW5FbmdpbmVSZXF1ZXN0RGV0YWlsc1BhZ2UgfSBmcm9tIFwiLi9hZG1pbi9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBtZ3Rsb2FkZXIgfSBmcm9tIFwiLi9tZ3QuanNcIjtcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4vbm90aWZpY2F0aW9uLmpzXCI7XHJcbmltcG9ydCB7IGhvbWVQYWdlIH0gZnJvbSBcIi4vaG9tZS9ob21lUGFnZS5qc1wiO1xyXG5pbXBvcnQgeyBzZXR0aW5nc1BhZ2UgfSBmcm9tIFwiLi9zZXR0aW5ncy9zZXR0aW5nc1BhZ2UuanNcIjtcclxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCIuL2F1dGguanNcIlxyXG5pbXBvcnQgeyBkb3RtaW10YWJsZSB9IGZyb20gXCIuL2RvdG1pbXRhYmxlXCJcclxuaW1wb3J0IHsgcGVyc29uRm9ybWF0dGVycyB9IGZyb20gJy4vZm9ybWF0dGVycy9pbmRleC5qcydcclxuaW1wb3J0IHsgZGF0YVNvdXJjZU5ldywgZGF0YVNvdXJjZXNQYWdlLCBkYXRhU291cmNlRWRpdCB9IGZyb20gJy4vZGF0YVNvdXJjZXMvaW5kZXguanMnXHJcbmltcG9ydCB7IGVudGl0aWVzUGFnZSwgZW50aXRpZXNOZXdQYWdlIH0gZnJvbSAnLi9lbnRpdGllcy9pbmRleC5qcydcclxuaW1wb3J0IGQgZnJvbSAnLi9leHRlbnNpb25zLmpzJztcclxuXHJcbmRvdG1pbXRhYmxlLmluaXRpYWxpemUoKTtcclxuXHJcbi8vIEluaXRpYWxpemUgaG9tZSBwYWdlIHRvIHJlZ2lzdGVyIG5vdGlmaWNhdGlvbnNcclxuaG9tZVBhZ2UuY3VycmVudC5pbml0aWFsaXplKCk7XHJcblxyXG4vLyBJbml0aWFsaXplIGF1dGggaGVscGVyXHJcbmF1dGguY3VycmVudC5pbml0aWFsaXplKCk7XHJcblxyXG5cclxubWd0bG9hZGVyLnNldE1ndFByb3ZpZGVyKCk7XHJcbm1ndGxvYWRlci5pbnRlcmNlcHRNZ3RMb2dpbigpO1xyXG5cclxucm91dGVyLnJlZ2lzdGVyKCcvRGFzaGJvYXJkJywgZGFzaGJvYXJkUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0Rhc2hib2FyZC9JbmRleCcsIGRhc2hib2FyZFBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbmdpbmVzJywgZW5naW5lc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbmdpbmVzL0luZGV4JywgZW5naW5lc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbmdpbmVzL0RldGFpbHMnLCBlbmdpbmVEZXRhaWxzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluL0luZGV4JywgYWRtaW5QYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvQWRtaW4nLCBhZG1pblBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9TZXR0aW5ncy9JbmRleCcsIHNldHRpbmdzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL1NldHRpbmdzJywgc2V0dGluZ3NQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvQWRtaW4vRGV0YWlscycsIGFkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvQWRtaW4vRGVwbG95JywgYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0RhdGFTb3VyY2VzJywgZGF0YVNvdXJjZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRGF0YVNvdXJjZXMvTmV3JywgZGF0YVNvdXJjZU5ldyk7XHJcbnJvdXRlci5yZWdpc3RlcignL0RhdGFTb3VyY2VzL0VkaXQnLCBkYXRhU291cmNlRWRpdCk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VudGl0aWVzJywgZW50aXRpZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW50aXRpZXMvTmV3JywgZW50aXRpZXNOZXdQYWdlKTtcclxuIl0sIm5hbWVzIjpbInJvdXRlciJdLCJtYXBwaW5ncyI6IkFBQUM7QUFDRDtBQUNPLE1BQU0sTUFBTSxDQUFDO0FBQ3BCO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoRDtBQUNBLFFBQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRjtBQUNBLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsUUFBUSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM3QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxjQUFjLEdBQUc7QUFDckIsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDaEMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxrQkFBa0IsR0FBRztBQUN6QixRQUFRLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDO0FBQzNDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUc7QUFDcEIsUUFBUSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxlQUFlLEdBQUc7QUFDdEIsUUFBUSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNmO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7QUFDcEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztBQUM3RCxZQUFZLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hELFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksaUJBQWlCLENBQUMsYUFBYSxFQUFFO0FBQ3JDLFFBQVEsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQztBQUMvQztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7QUFDekMsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRO0FBQ3pELFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN4QztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLGVBQWUsQ0FBQyxXQUFXLEVBQUU7QUFDakMsUUFBUSxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsUUFBUSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7QUFDN0IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUMzQjtBQUNBLFFBQVEsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRO0FBQzVDLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTtBQUNwQyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM1QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRztBQUNYO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQztBQUNkLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDcEQ7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVk7QUFDN0IsWUFBWSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlEO0FBQ0EsUUFBUSxJQUFJLFVBQVUsQ0FBQztBQUN2QjtBQUNBLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLO0FBQ25DLFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFlBQVksSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsWUFBWSxJQUFJLE9BQU87QUFDdkIsZ0JBQWdCLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDL0IsU0FBUyxFQUFDO0FBQ1Y7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVO0FBQ3ZCLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlO0FBQzVCLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pFO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDN0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFlBQVksQ0FBQyxDQUFDLE1BQU07QUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMxRSxhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtBQUN2QyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLE1BQU07QUFDL0MsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFFO0FBQzNDLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxlQUFlLElBQUksTUFBTSxFQUFFOztBQ3BLMUI7QUFFRDtBQUNBO0FBQ08sTUFBTSxhQUFhLENBQUM7QUFDM0I7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxNQUFNLEdBQUc7QUFDbkI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxPQUFPLENBQUMsU0FBUyxFQUFFO0FBQzdCLEtBQUs7QUFDTDtBQUNBLElBQUksUUFBUSxHQUFHO0FBQ2YsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQzFCQztBQUNEO0FBQ08sTUFBTSxXQUFXLENBQUM7QUFDekI7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixLQUFLO0FBQ0w7O0FDaEJDO0FBQ0Q7QUFDTyxNQUFNLFVBQVUsQ0FBQztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRTtBQUNwQixRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUNyQyxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUNqQyxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQzFCO0FBQ0EsUUFBUSxDQUFDLENBQUMsTUFBTTtBQUNoQixZQUFZLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3hEO0FBQ0EsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzNDO0FBQ0EsWUFBWSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNoRSxZQUFZLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5RCxZQUFZLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoRTtBQUNBLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO0FBQ2xDLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7QUFDbEMsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUM1QixRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRywrQ0FBK0MsQ0FBQztBQUM5RSxRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxHQUFHO0FBQ2IsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLCtDQUErQyxDQUFDO0FBQ3ZFLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQyxFQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUMsRUFBRTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksUUFBUSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFO0FBQ3hFO0FBQ0E7QUFDQSxJQUFJLEtBQUssR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdkM7QUFDQTtBQUNBLElBQUksWUFBWSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFO0FBQzFEO0FBQ0E7QUFDQSxJQUFJLFlBQVksR0FBRztBQUNuQixRQUFRLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDM0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRTtBQUN4RDtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQUssR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUM1QztBQUNBO0FBQ0EsSUFBSSxpQkFBaUIsR0FBRztBQUN4QjtBQUNBLFFBQVEsSUFBSSxLQUFLLEdBQUcsQ0FBQztBQUNyQiwwQkFBMEIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNqSSxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ2xFLHlDQUF5QyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdkQ7QUFDQSxvREFBb0QsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUMxRDtBQUNBO0FBQ0EsbUdBQW1HLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUM3RztBQUNBO0FBQ0E7QUFDQSxpRkFBaUYsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDMUY7QUFDQSxzQ0FBc0MsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxDQUFDLENBQUM7QUFDaEI7QUFDQSxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ3JCLEtBQUs7QUFDTDtBQUNBOztBQy9JTyxNQUFNLFFBQVEsQ0FBQztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLHFCQUFxQixHQUFHLElBQUksRUFBRTtBQUN2RDtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDakMsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEdBQUcscUJBQXFCLENBQUM7QUFDNUQ7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLHNCQUFzQjtBQUN2QyxZQUFZLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQztBQUMxRTtBQUNBO0FBQ0EsUUFBUSxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQzFDO0FBQ0EsUUFBUSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkM7QUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3RDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxHQUFHO0FBQ2hCO0FBQ0EsUUFBUSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDMUI7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtBQUMxRDtBQUNBLFlBQVksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQ3hELFlBQVksSUFBSSxDQUFDLElBQUk7QUFDckIsZ0JBQWdCLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztBQUNwRTtBQUNBLFlBQVksSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyRCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLE9BQU8sUUFBUSxDQUFDO0FBQ3hCLEtBQUs7QUFDTDtBQUNBLElBQUksWUFBWSxHQUFHO0FBQ25CLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0I7QUFDeEMsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzdDLFFBQVEsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFEO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssR0FBRztBQUNaLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixLQUFLO0FBQ0w7QUFDQSxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7QUFDN0I7QUFDQTtBQUNBLFFBQVEsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUc7QUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLG9IQUFvSCxDQUFDO0FBQ3ZJLFFBQVEsR0FBRyxJQUFJLFVBQVUsQ0FBQztBQUMxQixRQUFRLEdBQUcsSUFBSSxlQUFlLENBQUM7QUFDL0I7QUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLFFBQVEsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzVCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxDQUFDLElBQUksRUFBRTtBQUN4QjtBQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2xELFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZFLFFBQVEsR0FBRyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUNuRCxRQUFRLEdBQUcsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7QUFDNUQsUUFBUSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDO0FBQ3hCO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQyxRQUFRLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUM1QjtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksV0FBVyxDQUFDLElBQUksRUFBRTtBQUN0QjtBQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ2xELFFBQVEsR0FBRyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsR0FBRyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUNuRCxRQUFRLEdBQUcsSUFBSSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFDM0QsUUFBUSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDO0FBQ3hCO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQyxRQUFRLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUM1QjtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUN4QyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDekMsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUM1QztBQUNBO0FBQ0EsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQ3JCO0FBQ0E7QUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNsRCxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDbkQsUUFBUSxHQUFHLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQzVELFFBQVEsR0FBRyxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztBQUN4QjtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsUUFBUSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUIsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUMzSEM7QUFDRDtBQUNPLFNBQVMsS0FBSyxDQUFDLEVBQUUsRUFBRTtBQUMxQixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JDO0FBRUQ7QUFDTyxNQUFNLFFBQVEsQ0FBQztBQUN0QjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFFO0FBQ3pCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFO0FBQzlCLFFBQVEsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUN2QyxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3ZDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUMsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFO0FBQzVCLFFBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN6QixZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzlDO0FBQ0E7QUFDQSxRQUFRLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUN2QixZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksTUFBTSxFQUFFO0FBQ3BCO0FBQ0E7QUFDQSxZQUFZLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQ7QUFDQTtBQUNBLFlBQVksSUFBSSxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDbEMsZ0JBQWdCLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlDO0FBQ0E7QUFDQSxnQkFBZ0IsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMzQyxvQkFBb0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUyxNQUFNO0FBQ2YsWUFBWSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUMsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxFQUFFO0FBQ2xDO0FBQ0EsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDekI7QUFDQTtBQUNBLFFBQVEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUMzRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLE9BQU8sRUFBRTtBQUNyQjtBQUNBLFlBQVksSUFBSTtBQUNoQixnQkFBZ0IsS0FBSyxJQUFJLENBQUMsSUFBSSxPQUFPLEVBQUU7QUFDdkMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQztBQUM5QyxpQkFBaUI7QUFDakIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3hCLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsMEJBQTBCLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyRyxhQUFhO0FBQ2I7QUFDQSxTQUFTLE1BQU07QUFDZixZQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMzRixTQUFTO0FBQ1QsS0FBSztBQUNMOztBQ3RHQztBQUlEO0FBQ0E7QUFDQTtBQUNPLE1BQU0sWUFBWSxDQUFDO0FBQzFCO0FBQ0E7QUFDQSxJQUFJLE9BQU8sUUFBUTtBQUNuQjtBQUNBO0FBQ0EsSUFBSSxXQUFXLE9BQU8sR0FBRztBQUN6QixRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUTtBQUNsQyxZQUFZLFlBQVksQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztBQUN2RDtBQUNBLFFBQVEsT0FBTyxZQUFZLENBQUMsUUFBUSxDQUFDO0FBQ3JDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxTQUFTLEdBQUcsV0FBVztBQUNsQyxJQUFJLE9BQU8sU0FBUyxHQUFHLFdBQVc7QUFDbEMsSUFBSSxPQUFPLFdBQVcsR0FBRyxhQUFhO0FBQ3RDLElBQUksT0FBTyxZQUFZLEdBQUcsY0FBYztBQUN4QztBQUNBO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEIsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUNsQyxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ2pDO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLG9CQUFvQixFQUFFO0FBQzVELGFBQWEsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDcEQsYUFBYSxPQUFPLENBQUMsZ0JBQWdCLENBQUM7QUFDdEMsYUFBYSxzQkFBc0IsRUFBRTtBQUNyQyxhQUFhLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQ3JELGFBQWEsS0FBSyxFQUFFLENBQUM7QUFDckI7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFFLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3hFO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEtBQUs7QUFDL0MsWUFBWSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUNyQyxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM1RCxTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLEtBQUssR0FBRztBQUNsQixRQUFRLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUMzQjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVztBQUM1QixZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ2hDO0FBQ0EsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO0FBQ3JEO0FBQ0EsWUFBWSxVQUFVLEVBQUUsQ0FBQztBQUN6QjtBQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ25DLGdCQUFnQixNQUFNO0FBQ3RCLGFBQWE7QUFDYjtBQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO0FBQ2xGLGdCQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDakUsZ0JBQWdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM5QyxhQUFhO0FBQ2I7QUFDQSxZQUFZLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCO0FBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDbkMsZ0JBQWdCLE1BQU07QUFDdEIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtBQUNuRCxZQUFZLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3JDLFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3REO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLElBQUksR0FBRztBQUNqQjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFO0FBQzlFLFlBQVksTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pDLFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDbEMsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUNqQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUN4QixRQUFRLElBQUksTUFBTSxJQUFJLFlBQVksQ0FBQyxXQUFXO0FBQzlDLFlBQVksTUFBTSxJQUFJLFlBQVksQ0FBQyxZQUFZO0FBQy9DLFlBQVksTUFBTSxJQUFJLFlBQVksQ0FBQyxTQUFTO0FBQzVDLFlBQVksTUFBTSxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7QUFDOUM7QUFDQSxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMvQztBQUNBLFNBQVMsTUFBTTtBQUNmO0FBQ0EsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDaEQsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQ3pCLFFBQVEsSUFBSSxNQUFNLElBQUksWUFBWSxDQUFDLFdBQVc7QUFDOUMsWUFBWSxNQUFNLElBQUksWUFBWSxDQUFDLFlBQVk7QUFDL0MsWUFBWSxNQUFNLElBQUksWUFBWSxDQUFDLFNBQVM7QUFDNUMsWUFBWSxNQUFNLElBQUksWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUM5QztBQUNBLFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hEO0FBQ0EsU0FBUyxNQUFNO0FBQ2Y7QUFDQSxZQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNqRCxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0wsSUFBSSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUU7QUFDN0IsUUFBUSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3BDLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQ2hKQztBQUlEO0FBQ0E7QUFDTyxNQUFNLHNCQUFzQixDQUFDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7QUFDekMsUUFBUSxPQUFPLElBQUksc0JBQXNCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM3RCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRTtBQUNuQztBQUNBLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0FBQ25EO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbEU7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxLQUFLLEdBQUc7QUFDWixRQUFRLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNoQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRztBQUNYLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDbkMsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDckIsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUNwQztBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hHLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdFLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlGO0FBQ0E7QUFDQSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakY7QUFDQSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztBQUNwSSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsWUFBWSxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQztBQUM1SSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsWUFBWSxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztBQUMxSSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztBQUNwSTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM1QjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBQztBQUNoRDtBQUNBLFFBQVEsSUFBSSxxQkFBcUIsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pGO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLHFCQUFxQixDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDakQsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNyRCxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxNQUFNLHFCQUFxQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9EO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDNUIsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxQyxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxDQUFDLENBQUMsNkRBQTZELEdBQUcsYUFBYSxDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDN0o7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLHlEQUF5RCxDQUFDLENBQUM7QUFDakcsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0saUJBQWlCLENBQUMsR0FBRyxFQUFFO0FBQ2pDO0FBQ0EsUUFBUSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDN0I7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQzVCLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsOENBQThDLENBQUMsQ0FBQztBQUMzRixZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMzQztBQUNBO0FBQ0EsUUFBUSxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEc7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7QUFDdEc7QUFDQSxRQUFRLElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDcEMsUUFBUSxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQzNELFFBQVEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUNyRCxRQUFRLElBQUksV0FBVyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzFEO0FBQ0EsUUFBUSxJQUFJLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN0RTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDcEMsWUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLDRDQUE0QyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RyxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLGVBQWUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwRDtBQUNBLFFBQVEsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxFQUFDO0FBQ3pEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0scUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxRQUFRLE1BQU0sQ0FBQyxLQUFLO0FBQzVCLFlBQVksS0FBSyxPQUFPO0FBQ3hCLGdCQUFnQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0QsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFNBQVM7QUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssU0FBUztBQUMxQixnQkFBZ0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pFLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxLQUFLO0FBQ2pCLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtBQUN2QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQixRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEMsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUNoTEM7QUFHRDtBQUNPLE1BQU0sdUJBQXVCLENBQUM7QUFDckM7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QyxRQUFRLE9BQU8sSUFBSSx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzlELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLGlCQUFpQixFQUFFO0FBQ25DO0FBQ0EsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7QUFDbkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNsRTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEtBQUssR0FBRztBQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2hDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHO0FBQ1gsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9DLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25ELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM1RCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDdEU7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZFLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsRjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDNUI7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUM7QUFDekQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBQztBQUNoRDtBQUNBLFFBQVEsSUFBSSxjQUFjLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxjQUFjLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUMxQyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDBCQUEwQixFQUFDO0FBQ2hFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pEO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDckIsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsRUFBQztBQUNoRSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsRUFBQztBQUNsRztBQUNBLFFBQVEsSUFBSSxVQUFVLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEY7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDdEMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxrQ0FBa0MsRUFBQztBQUN4RSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwRDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDakQ7QUFDQSxRQUFRLElBQUksY0FBYyxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2pHLFlBQVksTUFBTSxFQUFFLE1BQU07QUFDMUIsWUFBWSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDMUQsWUFBWSxPQUFPLEVBQUU7QUFDckIsZ0JBQWdCLGNBQWMsRUFBRSxpQ0FBaUM7QUFDakUsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksY0FBYyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDMUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxnQ0FBZ0MsRUFBQztBQUN0RSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNULFFBQVEsSUFBSSxpQkFBaUIsR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1RDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxvQ0FBb0MsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQztBQUN6STtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQztBQUN4QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTTtBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLFFBQVEsTUFBTSxDQUFDLEtBQUs7QUFDNUIsWUFBWSxLQUFLLE9BQU87QUFDeEIsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssU0FBUztBQUMxQixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxTQUFTO0FBQzFCLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWTtBQUNaLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0QsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLEtBQUs7QUFDakIsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BCLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QyxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQ3BLQztBQUdEO0FBQ08sTUFBTSxvQkFBb0IsQ0FBQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixFQUFFO0FBQ3pDLFFBQVEsT0FBTyxJQUFJLG9CQUFvQixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDM0QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsaUJBQWlCLEVBQUU7QUFDbkM7QUFDQSxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUNuRDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2xFO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDaEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUc7QUFDWCxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDcEM7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0MsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN0RTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkUsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM1QjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBQztBQUN6RDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDO0FBQ2hEO0FBQ0EsUUFBUSxJQUFJLGNBQWMsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFFO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLGNBQWMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUM7QUFDaEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNyQixZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDBCQUEwQixFQUFDO0FBQ2hFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxFQUFDO0FBQ2hHLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyw4QkFBOEIsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFDO0FBQ2hHLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFDO0FBQ3BFO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzVDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsOEJBQThCLEVBQUM7QUFDcEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNyRDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUM7QUFDQSxRQUFRLElBQUksb0JBQW9CLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDdkcsWUFBWSxNQUFNLEVBQUUsTUFBTTtBQUMxQixZQUFZLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNyRCxZQUFZLE9BQU8sRUFBRTtBQUNyQixnQkFBZ0IsY0FBYyxFQUFFLGlDQUFpQztBQUNqRSxhQUFhO0FBQ2IsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxvQkFBb0IsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ2hELFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUM7QUFDaEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVCxRQUFRLElBQUksWUFBWSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0Q7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMseUNBQXlDLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDO0FBQ3JJO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLDRDQUE0QyxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUM7QUFDeEo7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsc0NBQXNDLENBQUMsRUFBQztBQUN6RTtBQUNBLFFBQVEsZ0JBQWdCLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDL0U7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksZ0JBQWdCLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUM1QyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDhCQUE4QixFQUFDO0FBQ3BFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLFFBQVEsR0FBRyxNQUFNLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pEO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDO0FBQ3hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsUUFBUSxNQUFNLENBQUMsS0FBSztBQUM1QixZQUFZLEtBQUssT0FBTztBQUN4QixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxTQUFTO0FBQzFCLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFNBQVM7QUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZO0FBQ1osZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzRCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksS0FBSztBQUNqQixZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDdkIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FDMUxDO0FBR0Q7QUFDTyxNQUFNLHFCQUFxQixDQUFDO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7QUFDekMsUUFBUSxPQUFPLElBQUkscUJBQXFCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM1RCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRTtBQUNuQztBQUNBLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0FBQ25EO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbEU7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxLQUFLLEdBQUc7QUFDWixRQUFRLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNoQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRztBQUNYLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDbkMsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDckIsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUNwQztBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2RSxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbEY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksTUFBTSxVQUFVLENBQUMsS0FBSyxFQUFFO0FBQzVCO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDO0FBQ3pEO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUM7QUFDaEQ7QUFDQSxRQUFRLElBQUksY0FBYyxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUU7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksY0FBYyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDMUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsRUFBQztBQUNoRSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUM7QUFDaEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEVBQUM7QUFDbEcsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUM7QUFDM0YsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLEVBQUM7QUFDcEU7QUFDQSxRQUFRLElBQUksZ0JBQWdCLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlFO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDNUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxnQ0FBZ0MsRUFBQztBQUN0RSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLFFBQVEsR0FBRyxNQUFNLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JEO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QztBQUNBLFFBQVEsSUFBSSxvQkFBb0IsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN2RyxZQUFZLE1BQU0sRUFBRSxNQUFNO0FBQzFCLFlBQVksSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3JELFlBQVksT0FBTyxFQUFFO0FBQ3JCLGdCQUFnQixjQUFjLEVBQUUsaUNBQWlDO0FBQ2pFLGFBQWE7QUFDYixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLG9CQUFvQixDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDaEQsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxnQ0FBZ0MsRUFBQztBQUN0RSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNULFFBQVEsSUFBSSxZQUFZLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3RDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxvQ0FBb0MsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUM7QUFDL0g7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUM7QUFDeEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0scUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxRQUFRLE1BQU0sQ0FBQyxLQUFLO0FBQzVCLFlBQVksS0FBSyxPQUFPO0FBQ3hCLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFNBQVM7QUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssU0FBUztBQUMxQixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxLQUFLO0FBQ2pCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtBQUN2QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQixRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEMsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUN0S0M7QUFFRDtBQUNBO0FBQ08sTUFBTSxpQkFBaUIsQ0FBQztBQUMvQjtBQUNBO0FBQ0EsSUFBSSxPQUFPLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QyxRQUFRLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3hELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLGlCQUFpQixFQUFFO0FBQ25DO0FBQ0EsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7QUFDbkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM1RTtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0QsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEtBQUssR0FBRztBQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ2pDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHO0FBQ1gsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoRCxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEQ7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekMsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwRCxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDNUI7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0E7QUFDQSxRQUFRLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDO0FBQy9DLFFBQVEsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBQztBQUM1RCxRQUFRLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFDO0FBQ25ELFFBQVEsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUM7QUFDakQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxtQkFBbUIsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQy9JO0FBQ0EsUUFBUSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDL0MsWUFBWSxJQUFJLFdBQVcsR0FBRyxNQUFNLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9EO0FBQ0EsWUFBWSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDcEM7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqRCxnQkFBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUM5RTtBQUNBLGdCQUFnQixJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUM7QUFDQSxnQkFBZ0IsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtBQUNwQyxvQkFBb0IsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNqQyx3QkFBd0IsS0FBSyxFQUFFLENBQUM7QUFDaEMsd0JBQXdCLEtBQUssRUFBRSxDQUFDO0FBQ2hDLHFCQUFxQixDQUFDLENBQUM7QUFDdkIsaUJBQWlCO0FBQ2pCO0FBQ0EsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUM7QUFDM0Msb0JBQW9CLE9BQU8sRUFBRSxPQUFPO0FBQ3BDLG9CQUFvQixJQUFJLEVBQUUsV0FBVztBQUNyQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25CO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkIsZ0JBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzVELGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDdkIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3pDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FDdEdDO0FBRUQ7QUFDQTtBQUNPLE1BQU0sZUFBZSxDQUFDO0FBQzdCO0FBQ0E7QUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixFQUFFO0FBQ3pDLFFBQVEsT0FBTyxJQUFJLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3RELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLGlCQUFpQixFQUFFO0FBQ25DO0FBQ0EsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7QUFDbkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNqRTtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0QsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEtBQUssR0FBRztBQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQy9CLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHO0FBQ1gsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUM7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkMsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsRCxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25ELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDNUI7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDLFFBQVEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUM7QUFDakQ7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxLQUFLLEVBQUUsRUFBRTtBQUNoRCxZQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUQsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2pFO0FBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsRCxZQUFZLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdkIsZ0JBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0M7QUFDQSxZQUFZLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQztBQUNBLFlBQVksSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksRUFBRTtBQUN2QyxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBLFlBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNO0FBQ3pDLGdCQUFnQiwrREFBK0QsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsOEVBQThFO0FBQzlLLGFBQWEsQ0FBQztBQUNkO0FBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQ25DLGdCQUFnQixPQUFPO0FBQ3ZCLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtBQUN2QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQixRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkMsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUN6RkM7QUFXRDtBQUNPLE1BQU0saUJBQWlCLENBQUM7QUFDL0I7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQixRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM1RCxRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUM3RCxRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN6RCxRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMxRDtBQUNBLFFBQVEsc0JBQXNCLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDL0QsUUFBUSx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNqRSxRQUFRLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzNELFFBQVEscUJBQXFCLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0Q7QUFDQSxRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDbEMsWUFBWSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBQy9FO0FBQ0EsWUFBWSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDeEUsZ0JBQWdCLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4RyxhQUFhLENBQUMsQ0FBQztBQUNmO0FBQ0EsWUFBWSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsUUFBUSxNQUFNLENBQUMsS0FBSztBQUM1QixZQUFZLEtBQUssT0FBTztBQUN4QixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxVQUFVO0FBQzNCLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFdBQVc7QUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZO0FBQ1osZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksS0FBSztBQUNqQixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FDNUVRLE1BQU0sV0FBVyxDQUFDO0FBQzFCO0FBQ0EsSUFBSSxPQUFPLFVBQVUsR0FBRztBQUN4QjtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN2QixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ3hEO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDN0MsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDL0MsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDdkMsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDN0M7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUMzQixRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksQ0FBQyxDQUFDO0FBQ3RDO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSztBQUNwQyxZQUFZLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNqQyxZQUFZLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN2QixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSztBQUNyQyxZQUFZLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNqQyxZQUFZLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDaEQsWUFBWSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEIsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUs7QUFDakMsWUFBWSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDakMsWUFBWSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELFlBQVksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hCLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLElBQUksR0FBRztBQUNqQixRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDeEY7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUI7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUs7QUFDaEQ7QUFDQSxZQUFZLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUNuQyxnQkFBZ0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxhQUFhO0FBQ2I7QUFDQSxZQUFZLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDcEMsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUM7QUFDQSxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEMsWUFBWSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztBQUN4QyxTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLEdBQUc7QUFDVixRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUIsUUFBUSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDekI7QUFDQSxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUk7QUFDekMsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekMsWUFBWSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEIsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLO0FBQzNCO0FBQ0EsWUFBWSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQztBQUN6SDtBQUNBLFlBQVksSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2pELFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxZQUFZLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0FBQ3hDLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0EsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRixLQUFLO0FBQ0w7QUFDQSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7QUFDcEIsUUFBUSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDaEUsUUFBUSxJQUFJLENBQUMsWUFBWTtBQUN6QixZQUFZLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDaEUsUUFBUSxJQUFJLENBQUMsWUFBWTtBQUN6QixZQUFZLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDN0I7QUFDQSxRQUFRLElBQUksR0FBRyxJQUFJLElBQUksUUFBUSxDQUFDO0FBQ2hDO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQztBQUN0RixLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksb0JBQW9CLEdBQUc7QUFDM0I7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDO0FBQy9CLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEQ7QUFDQSxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNEO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVTtBQUNuRSxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BEO0FBQ0EsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2RDtBQUNBLEtBQUs7QUFDTDs7QUNsSEM7QUFHRDtBQUNPLE1BQU0sU0FBUyxDQUFDO0FBQ3ZCO0FBQ0E7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQjtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxNQUFNLEdBQUc7QUFDbkIsS0FBSztBQUNMO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixLQUFLO0FBQ0w7QUFDQTs7QUNqQkM7QUFLRDtBQUNPLE1BQU0seUJBQXlCLENBQUM7QUFDdkM7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDNUQsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDN0QsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDekQsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDMUQsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztBQUMzRSxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pEO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7QUFDeEMsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnREFBZ0QsRUFBQztBQUN6RixZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakY7QUFDQSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWTtBQUNwRSxZQUFZLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNwRyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDaEUsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBQztBQUN4RCxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLHlCQUF5QixFQUFDO0FBQy9ELFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RELFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsWUFBWSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQztBQUN2SSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsWUFBWSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztBQUNySSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztBQUMvSDtBQUNBO0FBQ0EsUUFBUSxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLO0FBQy9DLFlBQVksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2pDO0FBQ0E7QUFDQSxZQUFZLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QztBQUNBLFlBQVksSUFBSSxDQUFDLE9BQU87QUFDeEIsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQSxZQUFZLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3hDLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLGNBQWMsR0FBRztBQUMzQixRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDOUI7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFDO0FBQ3ZELFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMseUJBQXlCLEVBQUM7QUFDM0Q7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUN4QyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLGdEQUFnRCxFQUFDO0FBQ3pGLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDcEU7QUFDQSxRQUFRLElBQUk7QUFDWjtBQUNBLFlBQVksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUNwRDtBQUNBLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUk7QUFDWixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7QUFDMUY7QUFDQTtBQUNBLFlBQVksSUFBSSxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3RDtBQUNBLFlBQVksSUFBSSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDaEU7QUFDQSxZQUFZLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDeEMsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFDdkcsZ0JBQWdCLElBQUksU0FBUyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksR0FBRTtBQUNyRCxnQkFBZ0IsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1RCxnQkFBZ0IsT0FBTztBQUN2QixhQUFhO0FBQ2I7QUFDQSxZQUFZLElBQUksZUFBZSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hEO0FBQ0EsWUFBWSxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUM7QUFDN0Q7QUFDQSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDcEIsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUNqRSxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2RCxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsUUFBUSxNQUFNLENBQUMsS0FBSztBQUM1QixZQUFZLEtBQUssT0FBTztBQUN4QixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxVQUFVO0FBQzNCLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFdBQVc7QUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZO0FBQ1osZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksS0FBSztBQUNqQixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxRQUFRLEdBQUc7QUFDckIsUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FDNUlDO0FBV0Q7QUFDTyxNQUFNLDZCQUE2QixDQUFDO0FBQzNDO0FBQ0E7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQjtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxNQUFNLEdBQUc7QUFDbkIsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDNUQsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDN0QsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDekQsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDMUQ7QUFDQSxRQUFRLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQy9ELFFBQVEsdUJBQXVCLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDakUsUUFBUSxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMzRCxRQUFRLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdEO0FBQ0EsUUFBUSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQjtBQUNBLFFBQVEsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ2xDLFlBQVksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztBQUMvRTtBQUNBLFlBQVksWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxZQUFZO0FBQ3hFLGdCQUFnQixNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEcsYUFBYSxDQUFDLENBQUM7QUFDZjtBQUNBLFlBQVksWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNyRixTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsUUFBUSxNQUFNLENBQUMsS0FBSztBQUM1QixZQUFZLEtBQUssT0FBTztBQUN4QixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxVQUFVO0FBQzNCLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFdBQVc7QUFDNUIsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZO0FBQ1osZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksS0FBSztBQUNqQixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEY7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUN0RU8sTUFBTSxTQUFTLENBQUM7QUFDdkI7QUFDQTtBQUNBLElBQUksT0FBTyxjQUFjLEdBQUc7QUFDNUIsUUFBUSxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0QsUUFBUSxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsOEJBQThCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDNUcsUUFBUSxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsb0NBQW9DLENBQUM7QUFDNUY7QUFDQSxRQUFRLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztBQUNoRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8saUJBQWlCLEdBQUc7QUFDL0IsUUFBUSxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQ25DQztBQUVEO0FBQ08sTUFBTSxJQUFJLENBQUM7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxPQUFPLFFBQVE7QUFDaEI7QUFDQTtBQUNBLENBQUMsV0FBVyxPQUFPLEdBQUc7QUFDdEIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7QUFDcEIsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDOUI7QUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN2QixFQUFFO0FBQ0Y7QUFDQSxDQUFDLE9BQU8sZUFBZSxHQUFHLGlCQUFpQjtBQUMzQztBQUNBLENBQUMsV0FBVyxHQUFHO0FBQ2YsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDakM7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLGVBQWUsR0FBRyx1QkFBdUIsQ0FBQztBQUNqRCxFQUFFO0FBQ0Y7QUFDQSxDQUFDLFVBQVUsR0FBRztBQUNkO0FBQ0EsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUNWO0FBQ0EsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxFQUFDO0FBQzNFLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRTtBQUNGO0FBQ0EsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRTtBQUMzQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxQyxFQUFFO0FBQ0Y7QUFDQSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFO0FBQ3pCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLEVBQUU7QUFDRjtBQUNBOztBQzFDQztBQUlEO0FBQ08sTUFBTSxRQUFRLENBQUM7QUFDdEI7QUFDQTtBQUNBLElBQUksT0FBTyxRQUFRO0FBQ25CO0FBQ0E7QUFDQSxJQUFJLFdBQVcsT0FBTyxHQUFHO0FBQ3pCLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRO0FBQzlCLFlBQVksUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDakMsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFVBQVUsR0FBRztBQUNqQixRQUFRLENBQUMsQ0FBQyxZQUFZLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDM0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLFlBQVk7QUFDckUsWUFBWSxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDekQsWUFBWSxNQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQ25ELFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckM7QUFDQTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtBQUMxQyxZQUFZLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFDZjtBQUNBLFlBQVksQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDckQ7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3ZEO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNEO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFEO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzdEO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEU7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLE1BQU0sSUFBSTtBQUM5RCxZQUFZLElBQUksTUFBTTtBQUN0QixnQkFBZ0IsTUFBTSxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztBQUN2RCxTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLHlCQUF5QixHQUFHO0FBQ3RDO0FBQ0E7QUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLG9CQUFvQixDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDOUQ7QUFDQSxRQUFRLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN0QztBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU87QUFDcEIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3ZDO0FBQ0EsUUFBUSxNQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQy9DLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSx5QkFBeUIsR0FBRztBQUN0QztBQUNBO0FBQ0EsUUFBUSxJQUFJLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQztBQUN2QyxRQUFRLElBQUksUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDO0FBQ0EsUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ3BDLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkM7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ25EO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDbkU7QUFDQSxZQUFZLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQjtBQUNBO0FBQ0EsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBQzdCO0FBQ0EsU0FBUyxNQUFNO0FBQ2Y7QUFDQSxZQUFZLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixZQUFZLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNuRTtBQUNBLFlBQVksS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ2xEO0FBQ0EsZ0JBQWdCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsR0FBRztBQUM3QixvQkFBb0IsUUFBUSxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsbUVBQW1FLENBQUMsQ0FBQztBQUMxSDtBQUNBLGdCQUFnQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDaEQ7QUFDQTtBQUNBLGtDQUFrQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDbEQsNEJBQTRCLEVBQUUsUUFBUSxDQUFDO0FBQ3ZDO0FBQ0EsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO0FBQy9CLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDNUIsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQyxRQUFRLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7QUFDOUI7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pELFFBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckQsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLG1CQUFtQixDQUFDLEtBQUssRUFBRTtBQUMvQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3JCO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xELFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2xFO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUU7QUFDM0MsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUs7QUFDNUQsWUFBWSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDakMsWUFBWSxNQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQ25ELFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FDMU9DO0FBQ0Q7QUFDTyxNQUFNLFlBQVksQ0FBQztBQUMxQjtBQUNBO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FDbEJRLFNBQVMsdUJBQXVCLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRTtBQUM5RjtBQUNBO0FBQ0EsSUFBSSxJQUFJLE9BQU8sR0FBRyxPQUFPLEdBQUcsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDO0FBQ25ELElBQUksSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLE1BQU0sR0FBRyxFQUFFLFVBQVUsQ0FBQztBQUNsRDtBQUNBLElBQUksSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLElBQUksSUFBSSxPQUFPO0FBQ2YsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3JCLFlBQVksS0FBSyxFQUFFLFVBQVU7QUFDN0IsWUFBWSxLQUFLLEVBQUUsSUFBSTtBQUN2QixTQUFTLEVBQUM7QUFDVjtBQUNBLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQztBQUNqQixRQUFRLEtBQUssRUFBRSxnQkFBZ0I7QUFDL0IsUUFBUSxLQUFLLEVBQUUsTUFBTTtBQUNyQixRQUFRLEtBQUssRUFBRSxJQUFJO0FBQ25CLFFBQVEsS0FBSyxFQUFFLFFBQVE7QUFDdkIsUUFBUSxlQUFlLEVBQUUsS0FBSztBQUM5QixRQUFRLFFBQVEsRUFBRSxJQUFJO0FBQ3RCLFFBQVEsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztBQUNuQyxZQUFZLE9BQU8sQ0FBQyxpREFBaUQsRUFBRSxLQUFLLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbEgsU0FBUztBQUNULEtBQUssRUFBRTtBQUNQLFFBQVEsS0FBSyxFQUFFLFlBQVk7QUFDM0IsUUFBUSxLQUFLLEVBQUUsUUFBUTtBQUN2QixRQUFRLEtBQUssRUFBRSxJQUFJO0FBQ25CLFFBQVEsS0FBSyxFQUFFLFFBQVE7QUFDdkIsUUFBUSxlQUFlLEVBQUUsS0FBSztBQUM5QixRQUFRLFFBQVEsRUFBRSxJQUFJO0FBQ3RCLFFBQVEsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztBQUNuQyxZQUFZLE9BQU8sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3RJLFNBQVM7QUFDVDtBQUNBLEtBQUssRUFBRTtBQUNQLFFBQVEsS0FBSyxFQUFFLFlBQVk7QUFDM0IsUUFBUSxLQUFLLEVBQUUsTUFBTTtBQUNyQixRQUFRLFFBQVEsRUFBRSxJQUFJO0FBQ3RCLFFBQVEsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztBQUNuQyxZQUFZLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9DLFNBQVM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQO0FBQ0EsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDO0FBQ2pDLFFBQVEsR0FBRyxFQUFFLEdBQUc7QUFDaEIsUUFBUSxNQUFNLEVBQUUsS0FBSztBQUNyQixRQUFRLFdBQVcsRUFBRSxLQUFLO0FBQzFCLFFBQVEsVUFBVSxFQUFFLEtBQUs7QUFDekIsUUFBUSxjQUFjLEVBQUUsS0FBSztBQUM3QixRQUFRLGFBQWEsRUFBRSxJQUFJO0FBQzNCLFFBQVEsVUFBVSxFQUFFLEtBQUs7QUFDekIsUUFBUSxTQUFTLEVBQUUsSUFBSTtBQUN2QixRQUFRLGVBQWUsRUFBRSxNQUFNO0FBQy9CLFlBQVksT0FBTyxtREFBbUQsQ0FBQztBQUN2RSxTQUFTO0FBQ1QsUUFBUSxPQUFPLEVBQUUsT0FBTztBQUN4QixRQUFRLFVBQVUsRUFBRSxVQUFVO0FBQzlCLFFBQVEsT0FBTyxFQUFFLE9BQU87QUFDeEIsUUFBUSxVQUFVLEVBQUUsT0FBTztBQUMzQixRQUFRLGVBQWUsRUFBRSxNQUFNLEVBQUUsT0FBTyxvR0FBb0csQ0FBQyxFQUFFO0FBQy9JLEtBQUssQ0FBQyxDQUFDO0FBQ1A7QUFDQTs7QUM5REM7QUFFRDtBQUNPLE1BQU0sZUFBZSxDQUFDO0FBQzdCO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQy9DO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2hEO0FBQ0EsUUFBUSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLDRCQUE0QixFQUFFLElBQUk7QUFDdEYsWUFBWSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztBQUMzQyxZQUFZLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3ZELFFBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztBQUM3QyxZQUFZLGVBQWUsRUFBRSxNQUFNLEVBQUUsT0FBTyxtRUFBbUUsQ0FBQyxFQUFFO0FBQ2xILFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssS0FBSztBQUNqRixZQUFZLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFGLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQztBQUNBLFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsWUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQzFCO0FBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUMxQixRQUFRLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksTUFBTSxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7QUFDdkM7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLFFBQVEsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlFLFFBQVEsSUFBSSxtQkFBbUIsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RCxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1RDtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXO0FBQzdCLFlBQVksSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDbEM7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUUsaUJBQWlCO0FBQ2xGLFlBQVksQ0FBQyxtQ0FBbUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLGtGQUFrRixDQUFDLENBQUMsQ0FBQztBQUN6SjtBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZFO0FBQ0EsUUFBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzVEO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLFFBQVEsR0FBRztBQUNyQjtBQUNBLEtBQUs7QUFDTDs7QUNwRUM7QUFFRDtBQUNPLE1BQU0sVUFBVSxDQUFDO0FBQ3hCO0FBQ0EsSUFBSSxXQUFXLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRTtBQUM1QztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDbkMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLFVBQVUsR0FBRztBQUNyQixRQUFRLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNoQyxLQUFLO0FBQ0wsSUFBSSxJQUFJLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUM7QUFDckM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUMsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3BELFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDdEU7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ2hDO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUU7QUFDdkMsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUNyQztBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUTtBQUN6QixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakM7QUFDQSxRQUFRLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDL0I7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ2hDLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxlQUFlLEdBQUc7QUFDdEI7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFlBQVksS0FBSztBQUM3RztBQUNBLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN0QyxZQUFZLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDMUMsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RDLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QztBQUNBLFlBQVksSUFBSSxZQUFZLEtBQUssT0FBTyxFQUFFO0FBQzFDLGdCQUFnQixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQy9DLGFBQWEsTUFBTSxJQUFJLFlBQVksS0FBSyxRQUFRLEVBQUU7QUFDbEQsZ0JBQWdCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDOUMsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDMUMsYUFBYSxNQUFNLElBQUksWUFBWSxLQUFLLE1BQU0sRUFBRTtBQUNoRCxnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQyxnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMxQyxhQUFhO0FBQ2I7QUFDQSxTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsUUFBUSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDckI7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxNQUFNO0FBQ3JDLFlBQVksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNyQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztBQUN0QyxZQUFZLFFBQVEsRUFBRSxJQUFJO0FBQzFCLFlBQVksS0FBSyxFQUFFLE1BQU07QUFDekIsWUFBWSxnQkFBZ0IsRUFBRSxLQUFLO0FBQ25DLFlBQVksVUFBVSxFQUFFO0FBQ3hCLGdCQUFnQixTQUFTLEVBQUUsTUFBTTtBQUNqQyxnQkFBZ0IsS0FBSyxFQUFFLEtBQUs7QUFDNUIsZ0JBQWdCLE1BQU0sRUFBRSxFQUFFO0FBQzFCLGFBQWE7QUFDYixZQUFZLGFBQWEsRUFBRSxLQUFLO0FBQ2hDLFlBQVksZUFBZSxFQUFFO0FBQzdCLGdCQUFnQixlQUFlLEVBQUUsTUFBTTtBQUN2QyxnQkFBZ0IscUJBQXFCLEVBQUUsT0FBTztBQUM5QyxnQkFBZ0IsY0FBYyxFQUFFLEtBQUs7QUFDckMsZ0JBQWdCLGtCQUFrQixFQUFFLEtBQUs7QUFDekMsZ0JBQWdCLG1CQUFtQixFQUFFLEVBQUU7QUFDdkMsYUFBYTtBQUNiLFlBQVksZ0JBQWdCLEVBQUU7QUFDOUIsZ0JBQWdCLGFBQWEsRUFBRSxLQUFLO0FBQ3BDLGFBQWE7QUFDYixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0scUJBQXFCLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUMvQyxRQUFRLElBQUksSUFBSSxDQUFDLGdCQUFnQjtBQUNqQyxZQUFZLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzlDO0FBQ0EsS0FBSztBQUNMLElBQUksTUFBTSxxQkFBcUIsQ0FBQyxJQUFJLEVBQUU7QUFDdEM7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNCLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QyxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxNQUFNO0FBQ3RDLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsSDtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzVEO0FBQ0EsUUFBUSxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtBQUNuQyxZQUFZLFFBQVEsRUFBRSxJQUFJO0FBQzFCLFlBQVksUUFBUSxFQUFFO0FBQ3RCLGdCQUFnQixRQUFRLEVBQUUscURBQXFEO0FBQy9FLGFBQWE7QUFDYixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxvQkFBb0IsR0FBRztBQUMzQjtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztBQUNsRCxZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLHVCQUF1QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJO0FBQ3hFLFlBQVksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQztBQUN0RCxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsS0FBSyxJQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDMUU7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLGdCQUFnQixHQUFHO0FBQ3ZCO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDbEMsWUFBWSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSztBQUNoRCxnQkFBZ0IsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3JDLGdCQUFnQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0RCxnQkFBZ0IsT0FBTyxJQUFJLENBQUM7QUFDNUIsYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUM5QixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLO0FBQzVDLGdCQUFnQixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDckM7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDeEMsb0JBQW9CLE9BQU8sS0FBSyxDQUFDO0FBQ2pDO0FBQ0EsZ0JBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELGdCQUFnQixPQUFPLElBQUksQ0FBQztBQUM1QixhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksWUFBWSxHQUFHO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7QUFDdkIsWUFBWSxPQUFPLElBQUksQ0FBQztBQUN4QjtBQUNBLFFBQVEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QztBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU87QUFDcEIsWUFBWSxPQUFPLEtBQUssQ0FBQztBQUN6QjtBQUNBLFFBQVEsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM5QyxRQUFRLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUM5QjtBQUNBLFFBQVEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNwRTtBQUNBLFFBQVEsSUFBSSxPQUFPLEVBQUU7QUFDckIsWUFBWSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFDLFlBQVksSUFBSSxJQUFJO0FBQ3BCLGdCQUFnQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDN0IsU0FBUztBQUNUO0FBQ0EsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQTs7QUMxTUM7QUFDTSxNQUFNLGtCQUFrQixDQUFDO0FBQ2hDO0FBQ0E7QUFDQSxJQUFJLE1BQU0sU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUNwRTtBQUNBLFFBQVEsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDL0M7QUFDQTtBQUNBLFFBQVEsSUFBSSxVQUFVLEtBQUssTUFBTSxFQUFFO0FBQ25DLFlBQVksTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMscUNBQXFDLEVBQUUsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztBQUM3RyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUNsQlEsTUFBTSx5QkFBeUIsQ0FBQztBQUN4QztBQUNBO0FBQ0EsSUFBSSxNQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7QUFDcEU7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7QUFDbkMsWUFBWSxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxxQ0FBcUMsRUFBRSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ3hHLFNBQVM7QUFLVDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQ2pCUSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RDO0FBQ0E7QUFDQSxJQUFJLE1BQU0sU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtBQUNwRTtBQUNBLFFBQVEsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtBQUNuQyxZQUFZLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLHFDQUFxQyxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ3JHLFNBQVM7QUFJVCxLQUFLO0FBQ0w7O0FDZEM7QUFLRDtBQUNPLE1BQU0sYUFBYSxTQUFTLFVBQVUsQ0FBQztBQUM5QztBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsS0FBSyxDQUFDLGdCQUFnQixFQUFFLDBCQUEwQixFQUFDO0FBQzNEO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0FBQzNELFFBQVEsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUkseUJBQXlCLEVBQUUsQ0FBQztBQUN6RSxRQUFRLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLHVCQUF1QixFQUFFLENBQUM7QUFDckUsUUFBUSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQ25DO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBLFFBQVEsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsS0FBSztBQUNsRyxZQUFZLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtBQUNqQztBQUNBLGdCQUFnQixJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ3RDO0FBQ0EsZ0JBQWdCLElBQUk7QUFDcEI7QUFDQSxvQkFBb0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7QUFDL0Msd0JBQXdCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM5RTtBQUNBLHdCQUF3QixJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU07QUFDN0MsNEJBQTRCLE9BQU87QUFDbkM7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsbURBQW1ELENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRTtBQUNqRztBQUNBLHdCQUF3QixJQUFJLENBQUMsSUFBSTtBQUNqQyw0QkFBNEIsT0FBTztBQUNuQztBQUNBLHdCQUF3QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJO0FBQzFELDRCQUE0QixPQUFPO0FBQ25DO0FBQ0Esd0JBQXdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDckQ7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksa0JBQWtCO0FBQy9FLDRCQUE0QixNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkk7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksWUFBWTtBQUN6RSw0QkFBNEIsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZJO0FBQ0Esd0JBQXdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLGFBQWE7QUFDMUUsNEJBQTRCLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM5STtBQUNBLHdCQUF3QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxVQUFVO0FBQ3ZFLDRCQUE0QixNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDNUk7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUM1QjtBQUNBLG9CQUFvQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakUsaUJBQWlCO0FBQ2pCO0FBQ0EsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDdEM7QUFDQSxhQUFhO0FBQ2IsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNoRTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFO0FBQy9DO0FBQ0EsWUFBWSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLO0FBQzVEO0FBQ0EsZ0JBQWdCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyQztBQUNBLGdCQUFnQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuRTtBQUNBLGdCQUFnQixJQUFJLFFBQVE7QUFDNUIsb0JBQW9CLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RHLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSUM7QUFLRDtBQUNPLE1BQU0sY0FBYyxDQUFDO0FBQzVCO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1RDtBQUNBLFFBQVEsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUU7QUFDL0M7QUFDQSxZQUFZLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUs7QUFDNUQsZ0JBQWdCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyQztBQUNBLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRO0FBQ2pDLG9CQUFvQixNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDM0csYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzVDO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JFO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUN6RDtBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pELFlBQVksSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkc7QUFDQSxZQUFZLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMvQztBQUNBLFlBQVksSUFBSSxXQUFXO0FBQzNCLGdCQUFnQixXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdDO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERDO0FBRUQ7QUFDTyxNQUFNLFlBQVksQ0FBQztBQUMxQjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQyxZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUMxQixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzFCLFFBQVEsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRDtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSx5QkFBeUIsRUFBRSxJQUFJO0FBQ25GLFlBQVksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDM0MsWUFBWSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO0FBQzNDLFlBQVksZUFBZSxFQUFFLE1BQU0sRUFBRSxPQUFPLHlEQUF5RCxDQUFDLEVBQUU7QUFDeEcsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssS0FBSztBQUMvRSxZQUFZLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN2RixTQUFTLENBQUMsQ0FBQztBQUNYLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7QUFDcEM7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELFFBQVEsSUFBSSxRQUFRLEdBQUcsQ0FBQyxrQ0FBa0MsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4RSxRQUFRLElBQUksZ0JBQWdCLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckQsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtBQUMxQixZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQy9CO0FBQ0EsUUFBUSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxpQkFBaUI7QUFDaEYsWUFBWSxDQUFDLCtCQUErQixFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsMEVBQTBFLENBQUMsQ0FBQyxDQUFDO0FBQzdJO0FBQ0EsUUFBUSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xFO0FBQ0EsUUFBUSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLFFBQVEsR0FBRztBQUNyQjtBQUNBLEtBQUs7QUFDTDs7QUN2RUM7QUFDRDtBQUNPLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLFNBQVMsQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7QUFDcEU7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7QUFDbkMsWUFBWSxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxrREFBa0QsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckcsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNsRSxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN4RDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUM5RSxRQUFRLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7QUFDNUY7QUFDQSxRQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQztBQUNoRztBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLFFBQVEsSUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUNsRjtBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUMsRUFBRSxDQUFDLENBQUM7QUFDckY7QUFDQSxRQUFRLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtBQUNuQyxZQUFZLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLHVCQUF1QixDQUFDLFFBQVEsRUFBRTtBQUM1QyxRQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMxRSxRQUFRLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QyxRQUFRLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN2QztBQUNBO0FBQ0EsUUFBUSxJQUFJLGNBQWMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLFFBQVEsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzlHLFFBQVEsSUFBSSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUMsUUFBUSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDN0I7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDN0IsWUFBWSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN0QyxZQUFZLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzdCLFlBQVksSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQ7QUFDQSxZQUFZLFdBQVcsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakU7QUFDQSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSztBQUM3QyxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQztBQUMxRixhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDakMsWUFBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDbkYsWUFBWSxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xEO0FBQ0EsU0FBUyxNQUFNO0FBQ2YsWUFBWSxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFO0FBQ0EsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25HO0FBQ0EsUUFBUSxJQUFJLGtCQUFrQjtBQUM5QixZQUFZLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BEO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLGtCQUFrQixDQUFDLFFBQVEsRUFBRTtBQUN2QyxRQUFRLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN2QztBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUMvRDtBQUNBLFFBQVEsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkc7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN4QjtBQUNBLFFBQVEsSUFBSSxTQUFTLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pGLFFBQVEsSUFBSSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkM7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDN0IsWUFBWSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN0QyxZQUFZLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1RCxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzdCLFlBQVksSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUM7QUFDQSxZQUFZLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRjtBQUNBLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxLQUFLO0FBQ3hDLGdCQUFnQixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQztBQUNyRixhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDNUIsWUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN4RSxZQUFZLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0MsU0FBUztBQUNULGFBQWE7QUFDYixZQUFZLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDeEQsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzFDO0FBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekY7QUFDQSxRQUFRLElBQUksYUFBYTtBQUN6QixZQUFZLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksd0JBQXdCLENBQUMsUUFBUSxFQUFFO0FBQ3ZDLFFBQVEsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkc7QUFDQSxRQUFRLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNO0FBQ3ZDLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pGO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU07QUFDbEMsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELFFBQVEsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFFBQVEsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQSxRQUFRLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDN0QsUUFBUSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDMUUsUUFBUSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzdELFFBQVEsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzRCxRQUFRLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRjtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQ3ZKQztBQUNEO0FBQ08sTUFBTSxxQkFBcUIsQ0FBQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sU0FBUyxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTtBQUNwRTtBQUNBLFFBQVEsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksVUFBVSxLQUFLLE1BQU0sRUFBRTtBQUNuQyxZQUFZLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGtEQUFrRCxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRyxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ25DO0FBQ0EsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEU7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsUUFBUSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0FBQzVGO0FBQ0EsUUFBUSxJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7QUFDbkMsWUFBWSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekUsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLHVCQUF1QixDQUFDLFFBQVEsRUFBRTtBQUM1QyxRQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMxRSxRQUFRLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QztBQUNBO0FBQ0EsUUFBUSxJQUFJLGNBQWMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLFFBQVEsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzlHLFFBQVEsSUFBSSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUMsUUFBUSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDN0I7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDN0IsWUFBWSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN0QyxZQUFZLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzdCLFlBQVksSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQ7QUFDQSxZQUFZLFdBQVcsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakU7QUFDQSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSztBQUM3QyxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQztBQUMxRixhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDakMsWUFBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDbkYsWUFBWSxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xEO0FBQ0EsU0FBUyxNQUFNO0FBQ2YsWUFBWSxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFO0FBQ0EsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25HO0FBQ0EsS0FBSztBQUNMOztBQ3ZFQztBQUtEO0FBQ08sTUFBTSxlQUFlLFNBQVMsVUFBVSxDQUFDO0FBQ2hEO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEIsUUFBUSxLQUFLLENBQUMsWUFBWSxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDckQ7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO0FBQ2pFLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUNuQyxDQUFDO0FBQ0Q7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0EsUUFBUSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdkI7QUFDQTtBQUNBLFFBQVEsaUJBQWlCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JEO0FBQ0E7QUFDQSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuQztBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxLQUFLO0FBQ2xHO0FBQ0EsWUFBWSxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUU7QUFDakM7QUFDQSxnQkFBZ0IsSUFBSTtBQUNwQjtBQUNBLG9CQUFvQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUMvQyx3QkFBd0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzlFO0FBQ0Esd0JBQXdCLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTTtBQUM3Qyw0QkFBNEIsT0FBTztBQUNuQztBQUNBLHdCQUF3QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUY7QUFDQSx3QkFBd0IsSUFBSSxDQUFDLElBQUk7QUFDakMsNEJBQTRCLE9BQU87QUFDbkM7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssSUFBSTtBQUMxRCw0QkFBNEIsT0FBTztBQUNuQztBQUNBLHdCQUF3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQ3JEO0FBQ0Esd0JBQXdCLElBQUksSUFBSSxJQUFJLGVBQWU7QUFDbkQsNEJBQTRCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNySTtBQUNBLHdCQUF3QixJQUFJLElBQUksSUFBSSxlQUFlO0FBQ25ELDRCQUE0QixNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUk7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUM1QjtBQUNBLG9CQUFvQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakUsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTLENBQUMsQ0FBQztBQUNYLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sUUFBUSxHQUFHO0FBQ3JCO0FBQ0EsS0FBSztBQUNMOztBQ3JFQztBQUNEO0FBQ0EsSUFBSSxhQUFhLEdBQUcsWUFBWTtBQUNoQztBQUNBO0FBQ0EsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUNoQixRQUFRLGFBQWEsRUFBRSxVQUFVLEdBQUcsRUFBRTtBQUN0QyxZQUFZLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QixZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekMsU0FBUztBQUNULEtBQUssQ0FBQyxDQUFDO0FBQ1A7QUFDQSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2hCLFFBQVEsWUFBWSxFQUFFLFlBQVk7QUFDbEMsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QyxTQUFTO0FBQ1QsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2hCLFFBQVEsTUFBTSxFQUFFLFlBQVk7QUFDNUIsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekMsU0FBUztBQUNULFFBQVEsT0FBTyxFQUFFLFlBQVk7QUFDN0IsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3RDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDeEMsU0FBUztBQUNULEtBQUssQ0FBQyxDQUFDO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2hCLFFBQVEsU0FBUyxFQUFFLFVBQVUsUUFBUSxFQUFFO0FBQ3ZDLFlBQVksT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEtBQUs7QUFDcEQsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUs7QUFDL0Qsb0JBQW9CLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtBQUMzQyx3QkFBd0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLHFCQUFxQjtBQUNyQixvQkFBb0IsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLGlCQUFpQixDQUFDLENBQUM7QUFDbkIsYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTO0FBQ1QsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDaEIsUUFBUSxTQUFTLEVBQUUsZ0JBQWdCLEdBQUcsRUFBRTtBQUN4QztBQUNBO0FBQ0EsWUFBWSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDNUI7QUFDQSxZQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMseUNBQXlDLENBQUMsQ0FBQyxRQUFRLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQUNySTtBQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxZQUFZLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsWUFBWSxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDO0FBQ0EsWUFBWSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELFlBQVksSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsRDtBQUNBLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNO0FBQ3BDLGdCQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDLENBQUM7QUFDckk7QUFDQSxZQUFZLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDO0FBQ0EsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU07QUFDcEMsZ0JBQWdCLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQztBQUN2RztBQUNBLFlBQVksWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUM7QUFDQSxZQUFZLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxZQUFZLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQztBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRDtBQUNBLFlBQVksWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDO0FBQ0EsWUFBWSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRTtBQUN6QztBQUNBLGdCQUFnQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEM7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNuQyxvQkFBb0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckUsaUJBQWlCLE1BQU07QUFDdkIsb0JBQW9CLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQy9DLGlCQUFpQjtBQUNqQjtBQUNBLGdCQUFnQixJQUFJLElBQUksR0FBRyxDQUFDLG1DQUFtQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0UsZ0JBQWdCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsZ0JBQWdCLFlBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2pGLGFBQWEsTUFBTTtBQUNuQixnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsb0RBQW9ELENBQUM7QUFDaEYsZ0JBQWdCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsZ0JBQWdCLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2pGLGFBQWE7QUFDYixZQUFZLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQztBQUNBLFNBQVM7QUFDVCxLQUFLLEVBQUM7QUFDTjtBQUNBLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDaEIsUUFBUSxTQUFTLEVBQUUsZ0JBQWdCLEdBQUcsRUFBRSxZQUFZLEVBQUU7QUFDdEQ7QUFDQSxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzFCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0EsWUFBWSxJQUFJLFlBQVksRUFBRTtBQUM5QjtBQUNBLGdCQUFnQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEQ7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLE9BQU87QUFDNUIsb0JBQW9CLE9BQU87QUFDM0IsYUFBYTtBQUNiO0FBQ0EsWUFBWSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDeEQ7QUFDQSxZQUFZLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDMUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDL0MsZ0JBQWdCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakQsYUFBYSxDQUFDLENBQUM7QUFDZjtBQUNBLFlBQVksSUFBSTtBQUNoQjtBQUNBLGdCQUFnQixJQUFJLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDaEQsb0JBQW9CLElBQUksRUFBRSxRQUFRO0FBQ2xDLG9CQUFvQixNQUFNLEVBQUUsTUFBTTtBQUNsQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25CO0FBQ0EsZ0JBQWdCLElBQUksWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pEO0FBQ0EsZ0JBQWdCLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksWUFBWSxLQUFLLEtBQUssRUFBRTtBQUN0RTtBQUNBLG9CQUFvQixJQUFJLFlBQVksRUFBRTtBQUN0QztBQUNBLHdCQUF3QixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDO0FBQ3RGLDRCQUE0QixJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RDtBQUNBLHdCQUF3QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDeEM7QUFDQSx3QkFBd0IsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRTtBQUNqRSw0QkFBNEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDeEYseUJBQXlCLE1BQU07QUFDL0IsNEJBQTRCLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZELHlCQUF5QjtBQUN6QjtBQUNBLHdCQUF3QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2pELDRCQUE0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekMsNEJBQTRCLFNBQVMsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUNwSDtBQUNBLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZO0FBQ3ZELGdDQUFnQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RSw2QkFBNkIsQ0FBQyxDQUFDO0FBQy9CLHlCQUF5QjtBQUN6QjtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsZ0JBQWdCLE9BQU8sWUFBWSxDQUFDO0FBQ3BDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN4QixnQkFBZ0IsT0FBTztBQUN2QixvQkFBb0IsTUFBTSxFQUFFO0FBQzVCLHdCQUF3QixlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMscUJBQXFCO0FBQ3JCLGlCQUFpQixDQUFDO0FBQ2xCLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVCxLQUFLLEVBQUM7QUFDTixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsQ0FBQyxhQUFhLEdBQUc7O0FDbE0vQjtBQWVEO0FBQ0EsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3pCO0FBQ0E7QUFDQSxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzlCO0FBQ0E7QUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFCO0FBQ0E7QUFDQSxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDM0IsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDOUI7QUFDQUEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDN0NBLFFBQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDbkRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pDQSxRQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQy9DQSxRQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDdkRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNDQSxRQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyQ0EsUUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNqREEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0NBLFFBQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUNqRUEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUM1REEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDakRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDbkRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDckRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNDQSxRQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMifQ==