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

    }

    generate() {

        if (this.panel() && this.panel().length > 0)
            return this;

        let modalHtmlDiv = this._generateModalHtml();
        $('body').append(modalHtmlDiv);

        return this;
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


    onShown(shownPanelEvent) { this.panel().on('shown.bs.modal', shownPanelEvent); }

    onShow(showPanelEvent) { this.panel().on('show.bs.modal', showPanelEvent); }

    onUnLoad(unloadPanelEvent) { this.panel().on('hide.bs.modal', unloadPanelEvent); }


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


    _generateModalHtml() {

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
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

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
            case "Dropping":
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
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

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
            case "Dropping":
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
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

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
            case "Dropping":
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
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

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
            case "Dropping":
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
        this.modalPreview = new modalPanel(modal_data_target).xl().center().generate();

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

        try {

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
        } catch (e) {
            new modalPanelError("errorPreview", e).show();

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
        this.modalUsers = new modalPanel(modal_data_target).sm().generate();

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


class modalPanelError$1 {


    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target, errorMessage) {

        this.modal_data_target = modal_data_target;
        this.errorMessage = errorMessage;
        this.modalError = new modalPanel(modal_data_target).xl().center().generate();

        this.modalError.onShown(e => this.shownPanel(e));
        this.modalError.onUnLoad(e => this.unloadPanel(e));
        this.modalError.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalError;
    }

    show() {
        this.modalError.panel().modal('show');
    }

    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalError.submitButton().hide();
        this.modalError.deleteButton().hide();

        this.modalError.body().empty();
        this.modalError.title().text("Error");
        this.modalError.body().text(this.errorMessage);
    }

    async shownPanel(event) {

        var button = $(event.relatedTarget); // Button that triggered the modal
    }

    unloadPanel(event) {
        this.modalError.body().empty();
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

    }

    async onLoad() {

        modalPanelUsers.initialize("panelDeploymentOwners");
        modalPanelUsers.initialize("panelDeploymentMembers");
        modalPanelUsers.initialize("panelRequestOwners");
        modalPanelUsers.initialize("panelRequestMembers");

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
        provider.logout = () => window.location.href = '/Account/SignOut';

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

        // No prefix for hiddent Step field, since it's directly binded into the PageModel
        this.$step = $(`#Step`);

        this.step = this.$step  && this.$step.val() ? parseInt(this.$step.val()) : 0;

        if (this.$spinner)
            this.$spinner.hide();

        this.boostrapEnginesTable();

        this.bootstrapWizard();

        this.bootstrapButtons();
    }


    bootstrapWizard() {

        // Step show event
        this.$smartWizard.on("showStep", async (e, anchorObject, stepNumber, stepDirection, stepPosition) => {

            // Update step
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

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureSqlDatabase`);

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

}

class dataSourceAzureDataLakeV2 {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);


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

}

class dataSourceAzureCosmosDb {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=CosmosDb`);


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
}

class dataSourceAzureBlobStorage {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobStorage`);


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

}

// @ts-check

class dataSourceNew extends wizardPage {

    constructor() {
        super('DataSourceView', '/dataSources/new/engines');

        this.dataSourceAzureSql = new dataSourceAzureSql();
        this.dataSourceAzureDataLakeV2 = new dataSourceAzureDataLakeV2();
        this.dataSourceAzureCosmosDb = new dataSourceAzureCosmosDb();
        this.dataSourceAzureBlobStorage = new dataSourceAzureBlobStorage();
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

                        if (type.toString().toLowerCase() == 'azureblobstorage')
                            await this.dataSourceAzureBlobStorage.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'cosmosdb')
                            await this.dataSourceAzureCosmosDb.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                    }

                } catch (e) {

                    this.$smartWizard.smartWizard("goToStep", 0);
                }

                this.$spinner?.hide();

            }
        });
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
            window.location.href = `/Entities/Details/${this.engine.id}/${$element.name}`;
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

        await element.loadAsync(`/entities/new/entities?dvt=AzureSqlTable&engineId=${engineId}`);

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

        this.$deltaPanel = $(`#deltaPanel`);

        this.$mode = $(`input[name="${this.htmlFieldPrefix.replace("_", "")}.Mode"]:checked`).val();
        this.hideOrShowDeltaPanel();    

        $(`input[name="${this.htmlFieldPrefix.replace("_", "")}.Mode"]`).change(() => {this.hideOrShowDeltaPanel();});


        setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
    }

    hideOrShowDeltaPanel() {

        this.$mode = $(`input[name="${this.htmlFieldPrefix.replace("_", "")}.Mode"]:checked`).val();

        if (this.$mode === "Delta") {
            this.$deltaPanel.show("fast");
        } else {
            this.$deltaPanel.hide("fast");
        }

    }

    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();
        this.$labelErrorTables.empty();

        let dataSourcesUrl = `/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureSqlDatabase`;

        try {

            let r = await fetch(dataSourcesUrl);
            let dataSources = [];

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }

            let dataSourcesJson = await r.json();

            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }));
            });

            if (!dataSources.length) {
                this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
                this.$dataSourcesSelectString.val('');

            } else {
                this.$dataSourcesSelectString.val(dataSources.join());

            }
            var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

            if (dataSourceSelected)
                await this.refreshTablesAsync(engineId);

        } catch (e) {
            this.$labelErrorDataSources.text("Unexpected Server error");
            this.$dataSourcesSelect.data("noneSelectedText", "Can't load Data Sources...");

            new modalPanelError$1("errorDataSources", e).show();
        }

        this.$dataSourcesSelect.enablePicker();

    }

    async refreshTablesAsync(engineId) {
        this.$labelErrorTables.empty();

        this.$tablesSelect.disablePicker("loading tables ...");

        let dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();
        let tables = [];
        let tablesUrl = `/api/AzureSqlDatabase/${engineId}/${dataSourceSelected}/tables`;

        try {


            let r = await fetch(tablesUrl);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
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

            var tableSelected = $(`#${this.htmlFieldPrefix}TableName option:selected`).val();

            if (tableSelected)
                this.setPreviewDataAttributes(engineId);

        } catch (e) {

            this.$labelErrorTables.text("Unexpected Server error");
            this.$tablesSelect.data("noneSelectedText", "Can't load Data Sources...");

            new modalPanelError$1("errorDataSources", e).show();

        }

        this.$tablesSelect.enablePicker();

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

        await element.loadAsync(`/entities/new/entities?dvt=DelimitedText&engineId=${engineId}`);

        // transform all select picker into selectpicker
        $('select').selectpicker();


        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        this.$dataSourcesJsonSelectString = $(`#${this.htmlFieldPrefix}DataSourcesJsonItemsString`);
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshStoragesPaths(engineId); });


        this.$directoryPathSelect = $(`#${this.htmlFieldPrefix}FullPath`);
        this.$labelErrorDirectoryPath = $("#labelErrorDirectoryPath");


        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
    }


    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();


        this.mapDataSources = new Map();
        let dataSources = [];
        try {

            let r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobStorage`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            let dataSourcesJson = await r.json();
            let dataSources1 = dataSourcesJson.map(item => { let i = {}; i.name = item.name; i.dataSourceType = item.dataSourceType; return i; });

            $.each(dataSources1, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item.name, text: item.name }));
            });

            r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobFS`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            dataSourcesJson = await r.json();
            let dataSources2 = dataSourcesJson.map(item => { let i = {}; i.name = item.name; i.dataSourceType = item.dataSourceType; return i; });

            $.each(dataSources2, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item.name, text: item.name }));
            });


            dataSources = dataSources1.concat(dataSources2);

            if (!dataSources.length) {
                this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
                this.$dataSourcesSelectString.val('');
                this.$dataSourcesJsonSelectString.val('');

            } else {

                this.$dataSourcesSelectString.val(dataSources.map(ds => ds.name).join());
                this.$dataSourcesJsonSelectString.val(JSON.stringify(dataSources));
            }
            var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

            if (dataSourceSelected)
                await this.refreshStoragesPaths(engineId, dataSourceSelected);

        } catch (e) {
            this.$labelErrorDataSources.text("Unexpected Server error");
            this.$dataSourcesSelect.data("noneSelectedText", "Can't load Data Sources...");
            this.$dataSourcesSelectString.val('');
            this.$dataSourcesJsonSelectString.val('');
            new modalPanelError$1("error", e).show();
        }

        this.$dataSourcesSelect.enablePicker();

    }


    async refreshStoragesPaths(engineId) {

        this.$directoryPathSelect.empty();
        this.$directoryPathSelect.disablePicker("Loading all paths ...");
        this.$labelErrorDirectoryPath.empty();

        let dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();
        let dataSources = JSON.parse(this.$dataSourcesJsonSelectString.val());


        let dataSource = dataSources.find(e => e.name == dataSourceSelected);

        let entityLocationTypeElement = $(`#${this.htmlFieldPrefix}LocationType`);

        if (dataSource.dataSourceType === 'AzureBlobStorage')
            entityLocationTypeElement.val('AzureBlobStorageLocation');
        else if (dataSource.dataSourceType === 'AzureBlobFS')
            entityLocationTypeElement.val('AzureBlobFSLocation');



        let directories = [];
        try {

            let r = await fetch(`/api/storages/${engineId}/${dataSource.name}/files`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDirectoryPath.text(text.error.message);
                return;
            }
            let directoriesJson = await r.json();
            directories = directoriesJson.map(item => item.name);

            $.each(directories, (i, item) => {
                this.$directoryPathSelect.append($('<option>', { value: item, text: item }));
            });
        } catch (e) {

            this.$labelErrorDirectoryPath.text("Unexpected Server error");
            this.$directoryPathSelect.data("noneSelectedText", "Can't load Storage files...");

            new modalPanelError$1("error", e).show();
        }

        this.$directoryPathSelect.enablePicker();

    }
}

// @ts-check

class entitiesParquet {

    constructor() {
        this.isLoaded = false;
    }

    /**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     */
    async loadAsync(htmlFieldPrefix, element, engineId) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/entities/new/entities?dvt=Parquet&engineId=${engineId}`);

        // transform all select picker into selectpicker
        $('select').selectpicker();

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        this.$dataSourcesJsonSelectString = $(`#${this.htmlFieldPrefix}DataSourcesJsonItemsString`);
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshStoragesPaths(engineId); });


        this.$directoryPathSelect = $(`#${this.htmlFieldPrefix}FullPath`);
        this.$labelErrorDirectoryPath = $("#labelErrorDirectoryPath");


        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
    }


    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();


        this.mapDataSources = new Map();
        let dataSources = [];
        try {

            let r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobStorage`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            let dataSourcesJson = await r.json();
            let dataSources1 = dataSourcesJson.map(item => { let i = {}; i.name = item.name; i.dataSourceType = item.dataSourceType; return i; });

            $.each(dataSources1, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item.name, text: item.name }));
            });

            r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobFS`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            dataSourcesJson = await r.json();
            let dataSources2 = dataSourcesJson.map(item => { let i = {}; i.name = item.name; i.dataSourceType = item.dataSourceType; return i; });

            $.each(dataSources2, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item.name, text: item.name }));
            });


            dataSources = dataSources1.concat(dataSources2);

            if (!dataSources.length) {
                this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
                this.$dataSourcesSelectString.val('');
                this.$dataSourcesJsonSelectString.val('');

            } else {

                this.$dataSourcesSelectString.val(dataSources.map(ds => ds.name).join());
                this.$dataSourcesJsonSelectString.val(JSON.stringify(dataSources));
            }
            var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

            if (dataSourceSelected)
                await this.refreshStoragesPaths(engineId, dataSourceSelected);

        } catch (e) {
            this.$labelErrorDataSources.text("Unexpected Server error");
            this.$dataSourcesSelect.data("noneSelectedText", "Can't load Data Sources...");
            this.$dataSourcesSelectString.val('');
            this.$dataSourcesJsonSelectString.val('');
            new modalPanelError$1("error", e).show();
        }

        this.$dataSourcesSelect.enablePicker();

    }


    async refreshStoragesPaths(engineId) {

        this.$directoryPathSelect.empty();
        this.$directoryPathSelect.disablePicker("Loading all paths ...");
        this.$labelErrorDirectoryPath.empty();

        let dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();
        let dataSources = JSON.parse(this.$dataSourcesJsonSelectString.val());


        let dataSource = dataSources.find(e => e.name == dataSourceSelected);

        let entityLocationTypeElement = $(`#${this.htmlFieldPrefix}LocationType`);

        if (dataSource.dataSourceType === 'AzureBlobStorage')
            entityLocationTypeElement.val('AzureBlobStorageLocation');
        else if (dataSource.dataSourceType === 'AzureBlobFS')
            entityLocationTypeElement.val('AzureBlobFSLocation');



        let directories = [];
        try {

            let r = await fetch(`/api/storages/${engineId}/${dataSource.name}/files`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDirectoryPath.text(text.error.message);
                return;
            }
            let directoriesJson = await r.json();
            directories = directoriesJson.map(item => item.name);

            $.each(directories, (i, item) => {
                this.$directoryPathSelect.append($('<option>', { value: item, text: item }));
            });
        } catch (e) {

            this.$labelErrorDirectoryPath.text("Unexpected Server error");
            this.$directoryPathSelect.data("noneSelectedText", "Can't load Storage files...");

            new modalPanelError$1("error", e).show();
        }

        this.$directoryPathSelect.enablePicker();

    }
}

// @ts-check

class entitiesNewPage extends wizardPage {

    constructor() {
        super('EntityView', '/entities/new/engines');

        this.entitiesAzureSql = new entitiesAzureSql();
        this.entitiesDelimitedText = new entitiesDelimitedText();
        this.entitiesParquet = new entitiesParquet();
        this.lastTypeSelected = '';
    }

    async onLoad() {
        // call base onLoad method
        super.onLoad();

        // init preview panel
        modalPanelPreview.initialize("panelPreview");

        // transform all select picker into selectpicker
        $('select').selectpicker();

        this.$smartWizard.on("leaveStep", (e, anchorObject, currentStepIndex, nextStepIndex, stepDirection) => {

            if (currentStepIndex == 1 && nextStepIndex == 2) {

                let type = $(`input[name="EntityView.EntityType"]:checked`).val();

                if (!type) {
                    return false;
                }

                if (type !== 'AzureSqlTable' && type !== 'DelimitedText' && type !== 'Parquet') {
                    new modalPanelError$1('entityStepNotExist', 'this entity is not yet implemented...').show();
                    return false;
                }

                this.$smartWizard.smartWizard("goToStep", 1);

            }

            return true;
        });

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

                        else if (type == 'DelimitedText')
                            await this.entitiesDelimitedText.loadAsync(this.htmlFieldPrefix, this.$properties, engineId);

                        else if (type == 'Parquet')
                            await this.entitiesParquet.loadAsync(this.htmlFieldPrefix, this.$properties, engineId);

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

class entitiesDetailsPage {

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
        this.$pipelinesTable = $("#pipelinesTable");

        if (!this.$pipelinesTable)
            return;

        this.$pipelinesTable.bootstrapTable();
    }

 
    async onUnLoad() {

    }
}

// @ts-check

class entitiesNewVersionPage {

    constructor() {

    }


    async onLoad() {

        $("input[type='number']").inputSpinner();

        // get wizard
        this.$smartWizard = $("#smartWizard");


        // bootstrap wizard
        this.$smartWizard.smartWizard({
            selected: 0,
            theme: 'default', // theme for the wizard, related css need to include for other than default theme
            autoAdjustHeight: false,
            justified: false,
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
            anchorSettings: {
                anchorClickable: true, // Enable/Disable anchor navigation
                enableAllAnchors: true, // Activates all anchors clickable all times
                markDoneStep: true, // Add done state on navigation
                markAllPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
                removeDoneStepOnNavigateBack: false, // While navigate back done step after active step will be cleared
                enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
            },
            keyboardSettings: {
                keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            },
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

            try {

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
            } catch (e) {
                new modalPanelError("errorExtensionPost", e).show();
            }

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
router$1.register('/Entities/Details', entitiesDetailsPage);
router$1.register('/Entities/Version', entitiesNewVersionPage);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIkNsaWVudFNyYy9yb3V0ZXIuanMiLCJDbGllbnRTcmMvZGFzaGJvYXJkL2Rhc2hib2FyZFBhZ2UuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVzUGFnZS5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsLmpzIiwiQ2xpZW50U3JjL2NvbnNvbGUyLmpzIiwiQ2xpZW50U3JjL2hlbHBlcnMuanMiLCJDbGllbnRTcmMvaGFuZGxlcnMuanMiLCJDbGllbnRTcmMvbm90aWZpY2F0aW9uLmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxEZWxldGVFbmdpbmUuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFicmlja3MuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFGYWN0b3J5LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxQcmV2aWV3LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxVc2Vycy5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsRXJyb3IuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVEZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9kb3RtaW10YWJsZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pblBhZ2UuanMiLCJDbGllbnRTcmMvYWRtaW4vYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9tZ3QuanMiLCJDbGllbnRTcmMvYXV0aC5qcyIsIkNsaWVudFNyYy9ob21lL2hvbWVQYWdlLmpzIiwiQ2xpZW50U3JjL3NldHRpbmdzL3NldHRpbmdzUGFnZS5qcyIsIkNsaWVudFNyYy9ib290c3RyYXBUYWJsZXMvZW5naW5lQm9vdHN0cmFwVGFibGUuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZXNQYWdlLmpzIiwiQ2xpZW50U3JjL3dpemFyZC93aXphcmRQYWdlLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZVNxbC5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VOZXcuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUVkaXQuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNQYWdlLmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzQXp1cmVTcWwuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzUGFycXVldC5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc05ld1BhZ2UuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNEZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc05ld1ZlcnNpb25QYWdlLmpzIiwiQ2xpZW50U3JjL2V4dGVuc2lvbnMuanMiLCJDbGllbnRTcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gQHRzLWNoZWNrIFxyXG5cclxuZXhwb3J0IGNsYXNzIHJvdXRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAocHNlKSA9PiB0aGlzLl9vbkxvY2F0aW9uQ2hhbmdlKHBzZSkpO1xyXG5cclxuICAgICAgICB0aGlzLl9pbml0KGxvY2F0aW9uLmhyZWYpO1xyXG5cclxuICAgICAgICAvLyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcclxuICAgICAgICAvLyBldmVudCBhZnRlciBhbiBoaXN0b3J5IGNhbGxiYWNrIHdoaXRoIHBvcHN0YXRlXHJcbiAgICAgICAgJCgoKSA9PiB0aGlzLl9ydW4oKSk7XHJcblxyXG5cclxuICAgIH1cclxuICBcclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZ2V0IHRoZSBjdXJyZW50IHZpZXcgbmFtZSAodGhlIC97Vmlld30gbmFtZSBwYWdlKVxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VmlldygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VmlldztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHt7W119fSBnZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAqL1xyXG4gICAgZ2V0UXVlcnlQYXJhbWV0ZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge1VSTH0gZ2V0IHRoZSBjdXJyZW50IHVybFxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VXJsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBnZXQgdGhlIGN1cnJlbnQgc3RhdGUgKHVzZWx5IGFmdGVyIGEgcG9zdCwgYW5kIGRlY2xhcmVkIGZyb20gdGhlIG5vZGUgdmlldyBpbiB7c3RhdGV9IG9iamVjdClcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFN0YXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0IHRoZSByb3V0ZXIgb24gZWFjaCB1cmwgcmVxdWVzdGVkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jIGN1cnJlbnQgbG9jYXRpb24gaHJlZlxyXG4gICAgICovXHJcbiAgICBfaW5pdChsb2MpIHtcclxuICAgICAgICAvL3RoaXMuY3VycmVudFVybCA9IG5ldyB1cmlqcyhsb2MpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVybCA9IG5ldyBVUkwobG9jKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IHZpZXdcclxuICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdGhpcy5jdXJyZW50VXJsLnBhdGhuYW1lO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAgICB0aGlzLmN1cnJlbnRVcmwuc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge1BvcFN0YXRlRXZlbnR9IHBvcFN0YXRlRXZlbnQgXHJcbiAgICAqL1xyXG4gICAgX29uTG9jYXRpb25DaGFuZ2UocG9wU3RhdGVFdmVudCkge1xyXG4gICAgICAgIHZhciBzcmNFbGVtID0gcG9wU3RhdGVFdmVudC5zcmNFbGVtZW50O1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKCFzcmNFbGVtIHx8ICFzcmNFbGVtLmxvY2F0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlICYmIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQpXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKTtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX2luaXQoc3JjRWxlbS5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB0aGlzLl9ydW4oKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgX2NyZWF0ZUluc3RhbmNlKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgdmFyIGZhY3RvcnkgPSBjb25zdHJ1Y3Rvci5iaW5kLmFwcGx5KGNvbnN0cnVjdG9yLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgZmFjdG9yeSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3N0YXRlXSBcclxuICAgICAqL1xyXG4gICAgbmF2aWdhdGVUbyh1cmwsIHN0YXRlKSB7XHJcblxyXG4gICAgICAgIGlmICh1cmwgPT09IHRoaXMuY3VycmVudFVybC5wYXRobmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUgPyBzdGF0ZSA6IHt9LCBcIlwiLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aE5hbWUgOiBwYXRobmFtZSB1cmlcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHBhZ2VIYW5kbGVyXHJcbiAgICAqL1xyXG4gICAgcmVnaXN0ZXIocGF0aE5hbWUsIHBhZ2VIYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0KHBhdGhOYW1lLCBwYWdlSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgX3J1bigpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gJChcIiNyb3V0ZXJTdGF0ZVwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IEpTT04ucGFyc2UodGhpcy5jdXJyZW50U3RhdGUpO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudEtleTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXAuZm9yRWFjaCgodiwgaykgPT4ge1xyXG4gICAgICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAoaywgJ2knKTtcclxuICAgICAgICAgICAgbGV0IGlzTWF0Y2ggPSByLnRlc3QodGhpcy5jdXJyZW50Vmlldyk7XHJcbiAgICAgICAgICAgIGlmIChpc01hdGNoKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudEtleSA9IGs7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50S2V5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50UGFnZUN0b3IgPSB0aGlzLm1hcC5nZXQoY3VycmVudEtleSk7XHJcblxyXG4gICAgICAgIGlmICghY3VycmVudFBhZ2VDdG9yKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLl9jcmVhdGVJbnN0YW5jZShjdXJyZW50UGFnZUN0b3IpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFBhZ2UpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2Uub25Mb2FkKSB7XHJcbiAgICAgICAgICAgICQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZS5vbkxvYWQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlciBoYXMgbG9hZGVkIHBhZ2UgXCIgKyB0aGlzLmN1cnJlbnRWaWV3KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZS5vblVubG9hZCkge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ2JlZm9yZXVubG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLy8gc2luZ2xldG9uXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyByb3V0ZXIoKTtcclxuXHJcblxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vcm91dGVyLmpzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIGRhc2hib2FyZFBhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSW5kZXggZ2V0IHRoZSBjdXJyZW50IHBhZ2UgaW5kZXhcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaChwYWdlSW5kZXgpIHtcclxuICAgIH1cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBlbmdpbmVzUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9zaG93blBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9zaG93UGFuZWwgPSAoZSkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMuX3VubG9hZFBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBcInJpZ2h0XCI7XHJcbiAgICAgICAgdGhpcy5fY2VudGVyID0gXCJcIjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGUoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhbmVsKCkgJiYgdGhpcy5wYW5lbCgpLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgbW9kYWxIdG1sRGl2ID0gdGhpcy5fZ2VuZXJhdGVNb2RhbEh0bWwoKTtcclxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKG1vZGFsSHRtbERpdik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBzbSgpIHtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBsZygpIHtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiIG1vZGFsLWxnXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIHhsKCkge1xyXG4gICAgICAgIHRoaXMuX2xhcmdlID0gXCIgbW9kYWwteGxcIjtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICByZWFkb25seSgpIHtcclxuICAgICAgICB0aGlzLl9kYXRhX3JlYWRvbmx5ID0gJ2RhdGEtYmFja2Ryb3A9XCJzdGF0aWNcIiBkYXRhLWtleWJvYXJkPVwiZmFsc2VcIiAnO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbnRlcigpIHtcclxuICAgICAgICB0aGlzLl9jZW50ZXIgPSBcIm1vZGFsLWRpYWxvZy1jZW50ZXJlZCBtb2RhbC1kaWFsb2ctc2Nyb2xsYWJsZVwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblNob3duKHNob3duUGFuZWxFdmVudCkgeyB0aGlzLnBhbmVsKCkub24oJ3Nob3duLmJzLm1vZGFsJywgc2hvd25QYW5lbEV2ZW50KSB9XHJcblxyXG4gICAgb25TaG93KHNob3dQYW5lbEV2ZW50KSB7IHRoaXMucGFuZWwoKS5vbignc2hvdy5icy5tb2RhbCcsIHNob3dQYW5lbEV2ZW50KSB9XHJcblxyXG4gICAgb25VbkxvYWQodW5sb2FkUGFuZWxFdmVudCkgeyB0aGlzLnBhbmVsKCkub24oJ2hpZGUuYnMubW9kYWwnLCB1bmxvYWRQYW5lbEV2ZW50KSB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gKi9cclxuICAgIHBhbmVsKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1gKSB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtKUXVlcnk8SFRNTEJ1dHRvbkVsZW1lbnQ+fSAqL1xyXG4gICAgc3VibWl0QnV0dG9uKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1TdWJtaXRCdXR0b25gKSB9XHJcblxyXG4gICAgLyoqICBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0gKi9cclxuICAgIGRlbGV0ZUJ1dHRvbigpIHtcclxuICAgICAgICByZXR1cm4gJChgIyR7dGhpcy5pZH1EZWxldGVCdXR0b25gKVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUJ1dHRvblRleHQodGV4dCkge1xyXG4gICAgICAgICQoYCMke3RoaXMuaWR9RGVsZXRlQnV0dG9uVGV4dGApLnRleHQodGV4dCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0qL1xyXG4gICAgY2xvc2VCdXR0b24oKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfUNsb3NlQnV0dG9uYCkgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxEaXZFbGVtZW50Pn0qL1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgYm9keSgpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9Qm9keWApIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MSFJFbGVtZW50Pn0qL1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGl0bGUoKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfVRpdGxlYCkgfVxyXG5cclxuXHJcbiAgICBfZ2VuZXJhdGVNb2RhbEh0bWwoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RhbCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgJHt0aGlzLl9wb3NpdGlvbn0gZmFkZVwiIGlkPVwiJHt0aGlzLmlkfVwiIHRhYmluZGV4PVwiLTFcIiAke3RoaXMuX2RhdGFfcmVhZG9ubHl9YXJpYS1sYWJlbGxlZGJ5PVwiJHt0aGlzLmlkfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nJHt0aGlzLl9sYXJnZX0gJHt0aGlzLl9jZW50ZXJ9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCR7dGhpcy5fbGFyZ2V9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiIGlkPVwiJHt0aGlzLmlkfVRpdGxlXCI+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiIGlkPVwiJHt0aGlzLmlkfUJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYXJrIGJ0bi1zbVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgaWQ9XCIke3RoaXMuaWR9Q2xvc2VCdXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXVuZG9cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDbG9zZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgaWQ9XCIke3RoaXMuaWR9U3VibWl0QnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zYXZlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3VibWl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi1zbVwiIGlkPVwiJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJhc2gtYWx0XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCIke3RoaXMuaWR9RGVsZXRlQnV0dG9uVGV4dFwiPkRlbGV0ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGFsO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu79cclxuXHJcbmV4cG9ydCBjbGFzcyBjb25zb2xlMiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxEaXZFbGVtZW50Pn0gcGFyZW50T3ZlcmZsb3dFbGVtZW50XHJcbiAgICAgKiovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBwYXJlbnRPdmVyZmxvd0VsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxUb3AgPSB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQucG9zaXRpb24oKS50b3A7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cuUHJpc20gPSB3aW5kb3cuUHJpc20gfHwge307XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHdpbmRvdy5QcmlzbS5tYW51YWwgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLl9tZ3Rsb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZ3Rsb2dpbicpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBfdXNlck5hbWUoKSB7XHJcblxyXG4gICAgICAgIGxldCB1c2VyTmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9tZ3Rsb2dpbiAmJiB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscykge1xyXG5cclxuICAgICAgICAgICAgbGV0IG1haWwgPSB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgaWYgKCFtYWlsKVxyXG4gICAgICAgICAgICAgICAgbWFpbCA9IHRoaXMuX21ndGxvZ2luLnVzZXJEZXRhaWxzLnVzZXJQcmluY2lwYWxOYW1lO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5hbWVNYXRjaCA9IG1haWwubWF0Y2goL14oW15AXSopQC8pO1xyXG4gICAgICAgICAgICB1c2VyTmFtZSA9IG5hbWVNYXRjaCA/IG5hbWVNYXRjaFsxXSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdXNlck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3Njcm9sbFRvRW5kKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9jb25zb2xlMi5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbmV3UG9zID0gdGhpcy5faW5pdGlhbFRvcCArIGhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50LnNjcm9sbFRvKG5ld1BvcywgMTAwKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kT2JqZWN0KGpzb25PYmplY3QpIHtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxldCBqc29uU3RyaW5nID0gUHJpc20uaGlnaGxpZ2h0KEpTT04uc3RyaW5naWZ5KGpzb25PYmplY3QsIG51bGwsIDIpLCBQcmlzbS5sYW5ndWFnZXMuanNvbiwgJ2pzb24nKTtcclxuXHJcbiAgICAgICAgbGV0IHN0ciA9IFwiPHByZSBjbGFzcz0nbWwtMyBtci0zIG10LTMnIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOndoaXRlO3doaXRlLXNwYWNlOnByZS13cmFwO3dpZHRoOjkwJTttYXgtaGVpZ2h0OjI1MHB4Oyc+PGNvZGU+XCI7XHJcbiAgICAgICAgc3RyICs9IGpzb25TdHJpbmc7XHJcbiAgICAgICAgc3RyICs9IFwiPC9jb2RlPjwvcHJlPlwiO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFwcGVuZFdhcm5pbmcobGluZSkge1xyXG5cclxuICAgICAgICBsZXQgc3RyID0gYDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3dcIj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdhcm5pbmdcIj4ke3RoaXMuX3VzZXJOYW1lKCl9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj46PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2FybmluZ1wiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRFcnJvcihsaW5lKSB7XHJcblxyXG4gICAgICAgIGxldCBzdHIgPSBgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvd1wiPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2cobGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGluZm8obGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGVycm9yKGxpbmUpIHsgdGhpcy5hcHBlbmRFcnJvcihsaW5lKTsgfVxyXG4gICAgd2FybihsaW5lKSB7IHRoaXMuYXBwZW5kV2FybmluZyhsaW5lKTsgfVxyXG5cclxuXHJcbiAgICBhcHBlbmRMaW5lKGxpbmUpIHtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHN0ciA9IGA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93XCI+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuLy9leHBvcnQgZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4vLyAgICB0aGlzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4vLyAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4vL31cclxuLy9leHBvcnQgZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuLy8gICAgdGhpcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuLy8gICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG5cclxuLy99XHJcblxyXG4vLy8qKlxyXG4vLyAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhX3VybFxyXG4vLyAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4vLyAqL1xyXG4vL2V4cG9ydCBmdW5jdGlvbiBsb2FkUGFydGlhbEFzeW5jKGRhdGFfdXJsLCBlbGVtZW50KSB7XHJcbi8vICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbi8vICAgICAgICBlbGVtZW50LmxvYWQoZGF0YV91cmwsIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpID0+IHtcclxuLy8gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4vLyAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4vLyAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuLy8gICAgICAgIH0pO1xyXG4vLyAgICB9KTtcclxuLy99XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgaGFuZGxlcnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWV0aG9kcyA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdNZXRob2RcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lIHx8ICFuZXdNZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gaGFuZGxlcnMgYWxyZWFkeSwgY3JlYXRlIGFuIGVtcHR5IGFycmF5XHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0pIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQcmV2ZW50aW5nIGFkZGluZyB0aGUgc2FtZSBoYW5kbGVyIG11bHRpcGxlIHRpbWVzLlxyXG4gICAgICAgIGlmICh0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0uaW5kZXhPZihuZXdNZXRob2QpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgdGhlIG1ldGhvZCB0byB0aGUgaGFuZGxlciBsaXN0XHJcbiAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdLnB1c2gobmV3TWV0aG9kKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGFuIGhhbmRsZXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIG1ldGhvZCBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gbWV0aG9kICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kTmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIGdldCBhbGwgaGFuZGxlcnMgd2l0aCB0aGlzIG1ldGhvZCBuYW1lXHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcblxyXG4gICAgICAgIC8vIGlmIGhhbmRsZXJzIGRvIG5vdCBleGlzdHMsIHJldHVyblxyXG4gICAgICAgIGlmICghaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uIGV4aXN0aW5nXHJcbiAgICAgICAgaWYgKG1ldGhvZCkge1xyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiBhbGwgaGFuZGxlcnNcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlSWR4ID0gaGFuZGxlcnMuaW5kZXhPZihtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgd2UgZm91bmQgaXQsIG1ha2UgYSBzcGxpY2UgaW4gdGhlIGhhbmRsZXJzIGxpc3RcclxuICAgICAgICAgICAgaWYgKHJlbW92ZUlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShyZW1vdmVJZHgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIG5vIG1vcmUgaGFuZGxlcnMsIGRlbGV0ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0ICAgXHJcbiAgICAgKi9cclxuICAgIGludm9rZSh0YXJnZXQsIC4uLnBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBtZXRob2RzIGFycmF5IHRvIGludm9rZVxyXG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLm1ldGhvZHNbdGFyZ2V0LnRvTG93ZXJDYXNlKCldO1xyXG5cclxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uIG1ldGhvZCBpbiB0aGUgbWV0aG9kcyBhcnJheSB0byBpbnZva2VcclxuICAgICAgICBpZiAobWV0aG9kcykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG0uYXBwbHkoX3RoaXMsIHBhcmFtZXRlcnMpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBIGNhbGxiYWNrIGZvciB0aGUgbWV0aG9kICR7dGFyZ2V0LnRvTG93ZXJDYXNlKCl9IHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTm8gY2xpZW50IG1ldGhvZCB3aXRoIHRoZSBuYW1lICcke3RhcmdldC50b0xvd2VyQ2FzZSgpfScgZm91bmQuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vd3d3cm9vdC9saWIvc2lnbmFsci9kaXN0L2Jyb3dzZXIvc2lnbmFsci5qc1wiIC8+XHJcblxyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuL2hlbHBlcnMuanNcIjtcclxuaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tIFwiLi9oYW5kbGVycy5qc1wiXHJcblxyXG4vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBub3RpZmljYXRpb24ge1xyXG5cclxuICAgIC8vIHNpbmdsZXRvblxyXG4gICAgc3RhdGljIF9jdXJyZW50O1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7bm90aWZpY2F0aW9ufSAqL1xyXG4gICAgc3RhdGljIGdldCBjdXJyZW50KCkge1xyXG4gICAgICAgIGlmICghbm90aWZpY2F0aW9uLl9jdXJyZW50KVxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uX2N1cnJlbnQgPSBuZXcgbm90aWZpY2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uX2N1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvLyBldmVudHNcclxuICAgIHN0YXRpYyBPblN0YXJ0ZWQgPSBcIk9uU3RhcnRlZFwiO1xyXG4gICAgc3RhdGljIE9uU3RvcHBlZCA9IFwiT25TdG9wcGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0ZWQgPSBcIk9uQ29ubmVjdGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0aW5nID0gXCJPbkNvbm5lY3RpbmdcIjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlcnMgPSBuZXcgaGFuZGxlcnMoKTtcclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IHNpZ25hbFIuSHViQ29ubmVjdGlvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAuY29uZmlndXJlTG9nZ2luZyhzaWduYWxSLkxvZ0xldmVsLk5vbmUpXHJcbiAgICAgICAgICAgIC53aXRoVXJsKCcvbm90aWZpY2F0aW9ucycpXHJcbiAgICAgICAgICAgIC53aXRoQXV0b21hdGljUmVjb25uZWN0KClcclxuICAgICAgICAgICAgLmNvbmZpZ3VyZUxvZ2dpbmcoc2lnbmFsUi5Mb2dMZXZlbC5UcmFjZSlcclxuICAgICAgICAgICAgLmJ1aWxkKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbnJlY29ubmVjdGluZyhlcnJvciA9PiB0aGlzLl9jb25zb2xlLmxvZyhlcnJvcikpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbmNsb3NlKGVycm9yID0+IHRoaXMub25Db25uZWN0aW9uRXJyb3IoZXJyb3IpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uKFwiY29ubmVjdGVkXCIsIChfKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgICAgIGxldCByZXRyeUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3RhcnRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaWxlICghdGhpcy5faXNDb25uZWN0ZWQgJiYgcmV0cnlDb3VudCA8IDUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHJ5Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgPT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZyk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc3RhcnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgZGVsYXkoMTUwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkIHx8IHJldHJ5Q291bnQgPj0gNSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXJ0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IHRyaWVzIHRvIGNvbm5lY3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uU3RhcnRlZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgIT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLmludm9rZShub3RpZmljYXRpb24uT25TdG9wcGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9uKG1ldGhvZCwgaGFuZGxlcik7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub24obWV0aG9kLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBvbkNvbm5lY3Rpb25FcnJvcihlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciAmJiBlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUge1xyXG5cclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxEZWxldGVFbmdpbmUobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLmNsaWNrKGFzeW5jIChldmVudCkgPT4geyBhd2FpdCB0aGlzLmRlbGV0ZUVuZ2luZUFzeW5jKGV2ZW50KSB9KTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXY+Jm5ic3A7PC9kaXY+XCIpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXYgY2xhc3M9J2NvbnNvbGUnPjwvZGl2PlwiKTtcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIEpRdWVyeTxIVE1MRGl2RWxlbWVudD4gKi9cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlRWxlbWVudCA9IHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmZpbmQoJy5jb25zb2xlJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlID0gbmV3IGNvbnNvbGUyKHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQsIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpKTtcclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIGV2ZW50IGZyb20gc2lnbmFsciBhYm91dCBkZXBsb3ltZW50XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgY29ubmVjdGluZy4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RlZC4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgZW5naW5lIHJlcXVlc3QgaWQsIGFuZCBzZXQgaXQgZ2xvYmFseVxyXG4gICAgICAgIHRoaXMuZW5naW5lSWQgPSBidXR0b24uZGF0YSgnZW5naW5lLWlkJylcclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZVJlcXVlc3RSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVxdWVzdFJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgJChsb2NhdGlvbikuYXR0cignaHJlZicsICcvQWRtaW4vSW5kZXgnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZVJlcXVlc3QgPSBhd2FpdCBlbmdpbmVSZXF1ZXN0UmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAvLyB0aW1lb3V0IG9mIHRoZSBwYWdlIGZvciBzb21lIHJlYXNvbiA/XHJcbiAgICAgICAgaWYgKCFlbmdpbmVSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgICQobG9jYXRpb24pLmF0dHIoJ2hyZWYnLCAnLycpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLnNob3coKTtcclxuXHJcbiAgICAgICAgJChcIjxkaXYgY2xhc3M9J20tMic+QXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBlbmdpbmUgPGI+XCIgKyBlbmdpbmVSZXF1ZXN0LmVuZ2luZU5hbWUgKyBcIjwvYj4gPzwvZGl2PlwiKS5pbnNlcnRCZWZvcmUodGhpcy5kZWxldGVDb25zb2xlRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiUmVhZHkgdG8gZGVsZXRlLiBQbGVhc2UgcHJlc3MgJ0RlbGV0ZScgYnV0dG9uIHRvIHN0YXJ0LlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtKUXVlcnkuQ2xpY2tFdmVudDxIVE1MQnV0dG9uRWxlbWVudCwgbnVsbCwgSFRNTEJ1dHRvbkVsZW1lbnQsIEhUTUxCdXR0b25FbGVtZW50Pn0gZXZ0ICovXHJcbiAgICBhc3luYyBkZWxldGVFbmdpbmVBc3luYyhldnQpIHtcclxuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5lbmdpbmVJZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoXCJVbmFibGUgdG8gcmV0cmlldmUgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLi4uLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gR2V0IG5vdGlmaWNhdGlvbiBoZWxwZXJcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuICAgICAgICAvLyBzdWJzY3JpYmUgdG8gdGhpcyBkZXBsb3ltZW50IChmb3IgdGhpcyB1c2VyKVxyXG4gICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LmNvbm5lY3Rpb24uaW52b2tlKCdTdWJzY3JpYmVEZXBsb3ltZW50QXN5bmMnLCB0aGlzLmVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJXYWl0aW5nIGZvciBhbiBhZ2VudCB0byBlbnF1ZXVlIHRoZSBlbmdpbmUgZHJvcCBvcGVyYXRpb24uLi5cIik7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGxldCB1cmxEZWxldGlvbiA9IGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWA7XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybERlbGV0aW9uLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRFcnJvcihgVW5hYmxlIHRvIGRlbGV0ZSB0aGUgZW5naW5lIHJlcXVlc3Qgd2l0aCBJZCAke3RoaXMuZW5naW5lSWR9IGApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZHJvcEVuZ2luZVN0YXJ0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZShkcm9wRW5naW5lU3RhcnQpXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwaW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyByZW1vdmUgdW5lY2Vzc2FyeSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuY29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuY29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24uLi5gKVxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZSA9IGF3YWl0IGVuZ2luZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgUmVzb3VyY2UgZ3JvdXAgPHN0cm9uZz4ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX08L3N0cm9uZz4gLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJnUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJnUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgZ3JvdXAgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VHcm91cCA9IGF3YWl0IHJnUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlR3JvdXApO1xyXG5cclxuICAgICAgICBsZXQgcmdMaW5rUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX0vbGlua2AsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaWQ6IHJlc291cmNlR3JvdXAuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJnTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlR3JvdXBMaW5rID0gYXdhaXQgcmdMaW5rUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgQXp1cmUgcmVzb3VyY2UgZ3JvdXAgbGluayA6IDxhIGhyZWY9JHtyZXNvdXJjZUdyb3VwTGluay51cml9IHRhcmdldD1cIl9ibGFua1wiPiR7cmVzb3VyY2VHcm91cC5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwaW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsRGF0YWJyaWNrcyB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbERhdGFicmlja3MobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyByZW1vdmUgdW5lY2Vzc2FyeSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuY29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuY29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24uLi5gKVxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZSA9IGF3YWl0IGVuZ2luZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgUmVzb3VyY2UgZ3JvdXA6IDxzdHJvbmc+JHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9PC9zdHJvbmc+LmApXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERhdGFicmlja3Mgd29ya3NwYWNlOiA8c3Ryb25nPiR7ZW5naW5lLmNsdXN0ZXJOYW1lfTwvc3Ryb25nPi5gKVxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQXp1cmUuLi5gKVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2RhdGFicmlja3MvJHtlbmdpbmUuaWR9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGRhdGFicmlja3MgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2UgPSBhd2FpdCByZXNvdXJjZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmtSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3Jlc291cmNlZ3JvdXBzLyR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfS9saW5rYCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZDogcmVzb3VyY2UuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlTGluayA9IGF3YWl0IHJlc291cmNlTGlua1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEF6dXJlIERhdGFicmlrcyB3b3Jrc3BhY2UgbGluazogPGEgaHJlZj1cIiR7cmVzb3VyY2VMaW5rLnVyaX1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlLm5hbWV9PC9hPmApXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEYXRhYnJpY2tzIHdvcmtzcGFjZSBsaW5rOiA8YSBocmVmPVwiaHR0cHM6Ly8ke3Jlc291cmNlLnByb3BlcnRpZXMud29ya3NwYWNlVXJsfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cmVzb3VyY2UubmFtZX08L2E+YClcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24gZnJvbSBEYXRhYnJpY2tzLi4uYClcclxuXHJcbiAgICAgICAgcmVzb3VyY2VSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2RhdGFicmlja3MvJHtlbmdpbmUuaWR9L2NsdXN0ZXJgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZGF0YWJyaWNrcyBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlc291cmNlID0gYXdhaXQgcmVzb3VyY2VSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QocmVzb3VyY2UpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERvbmUuYClcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9wcGluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9wcGVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbERhdGFGYWN0b3J5IHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGF0YUZhY3RvcnkobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyByZW1vdmUgdW5lY2Vzc2FyeSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuY29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuY29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24uLi5gKVxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZSA9IGF3YWl0IGVuZ2luZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgUmVzb3VyY2UgZ3JvdXAgPHN0cm9uZz4ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX08L3N0cm9uZz4gLi4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRGF0YSBmYWN0b3J5IFYyOiA8c3Ryb25nPiR7ZW5naW5lLmZhY3RvcnlOYW1lfTwvc3Ryb25nPi5gKVxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQXp1cmUuLi5gKVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2RhdGFmYWN0b3JpZXMvJHtlbmdpbmUuaWR9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGRhdGEgZmFjdG9yeSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlTGlua1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9L2xpbmtgLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGlkOiByZXNvdXJjZS5pZCB9KSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VMaW5rUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgZ3JvdXAgbGluay5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzb3VyY2VMaW5rID0gYXdhaXQgcmVzb3VyY2VMaW5rUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgQXp1cmUgcmVzb3VyY2UgZ3JvdXAgbGluayA6IDxhIGhyZWY9JHtyZXNvdXJjZUxpbmsudXJpfSB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlLm5hbWV9PC9hPmApXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEb25lLmApXHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFByZXZpZXcge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFByZXZpZXcobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkueGwoKS5jZW50ZXIoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsUHJldmlldztcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLnRleHQoJ0xvYWRpbmcgLi4uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xyXG4gICAgICAgIHZhciBlbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG4gICAgICAgIHZhciBkYXRhU291cmNlTmFtZSA9IGJ1dHRvbi5kYXRhKCdkYXRhLXNvdXJjZS1uYW1lJylcclxuICAgICAgICB2YXIgc2NoZW1hTmFtZSA9IGJ1dHRvbi5kYXRhKCdzY2hlbWEtbmFtZScpXHJcbiAgICAgICAgdmFyIHRhYmxlTmFtZSA9IGJ1dHRvbi5kYXRhKCd0YWJsZS1uYW1lJylcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcmV2aWV3Um93c1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvQXp1cmVTcWxEYXRhYmFzZS8ke2VuZ2luZUlkfS8ke2RhdGFTb3VyY2VOYW1lfS90YWJsZXMvJHtzY2hlbWFOYW1lfS8ke3RhYmxlTmFtZX0vcHJldmlld2ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByZXZpZXdSb3dzUmVzcG9uc2Uuc3RhdHVzICE9IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZpZXdSb3dzID0gYXdhaXQgcHJldmlld1Jvd3NSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpZXdSb3dzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuYXBwZW5kKFwiPHRhYmxlIGlkPSd0YWJsZSc+PC90YWJsZT5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cxID0gcHJldmlld1Jvd3NbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2x1bW5zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbyBpbiByb3cxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3RhYmxlJykuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBwcmV2aWV3Um93c1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS50ZXh0KCdObyByb3dzLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvclByZXZpZXdcIiwgZSkuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFVzZXJzIHtcclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxVc2Vycyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnNtKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbFVzZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS50ZXh0KCdMb2FkaW5nIC4uLicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuICAgICAgICB2YXIgdXNlcnNJZHNWYWwgPSBidXR0b24uZGF0YSgndXNlcnMtaWQnKSAvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xyXG5cclxuICAgICAgICBpZiAoIXVzZXJzSWRzVmFsIHx8IHVzZXJzSWRzVmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLnRleHQoJ05vdGhpbmcgdG8gc2hvdy4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVzZXJzSWRzID0gdXNlcnNJZHNWYWwuc3BsaXQoJywnKS5tYXAodiA9PiB2LnRyaW0oKSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXNlcnNJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdXNlcklkID0gdXNlcnNJZHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXVzZXJJZCB8fCB1c2VySWQgPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkuYXBwZW5kKFxyXG4gICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdtLTMnIHN0eWxlPSdvdmVyZmxvdzphdXRvOyc+PG1ndC1wZXJzb24gdXNlci1pZD0nXCIgKyB1c2Vyc0lkc1tpXSArIFwiJyBmZXRjaC1pbWFnZT0ndHJ1ZScgcGVyc29uLWNhcmQ9J2hvdmVyJyB2aWV3PSd0d29MaW5lcyc+PC9tZ3QtcGVyc29uPjwvZGl2PlwiXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbEVycm9yIHtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0LCBlcnJvck1lc3NhZ2UpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZXJyb3JNZXNzYWdlO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvciA9IG5ldyBtb2RhbFBhbmVsKG1vZGFsX2RhdGFfdGFyZ2V0KS54bCgpLmNlbnRlcigpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3Iub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3Iub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxFcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5wYW5lbCgpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci50aXRsZSgpLnRleHQoXCJFcnJvclwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3IuYm9keSgpLnRleHQodGhpcy5lcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG4gICAgfVxyXG5cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHtcclxuICAgIG1vZGFsUGFuZWxVc2VycyxcclxuICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUsXHJcbiAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCxcclxuICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLFxyXG4gICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5XHJcbn0gZnJvbSBcIi4uL21vZGFsL2luZGV4LmpzXCI7XHJcblxyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGVuZ2luZURldGFpbHNQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLmluaXRpYWxpemUoXCJwYW5lbERlbGV0ZUVuZ2luZVwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cC5pbml0aWFsaXplKFwicGFuZWxSZXNvdXJjZUdyb3VwXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLmluaXRpYWxpemUoXCJwYW5lbERhdGFicmlja3NcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5LmluaXRpYWxpemUoXCJwYW5lbERhdGFGYWN0b3J5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gJChcIiNJZFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCQoXCIjY29uc29sZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMiA9IG5ldyBjb25zb2xlMigkKFwiI2NvbnNvbGVcIiksICQoJ2Rpdi5kb2NraW5nLWZvcm0nKSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcbiIsIu+7v2V4cG9ydCBjbGFzcyBkb3RtaW10YWJsZSB7XHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHVybCwgdXJsQ291bnQsIHBhZ2VTaXplKSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxDb3VudCA9IHVybENvdW50ID8/IHRoaXMudXJsICsgXCIvY291bnRcIjtcclxuXHJcbiAgICAgICAgdGhpcy5zcGlubmVyID0gJCgnI3NwaW5uZXItJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMuYm9keSA9ICQoJyN0Ym9keS0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91cyA9ICQoJyNwcmV2aW91cy0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5uZXh0ID0gJCgnI25leHQtJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCA9ICQoJyNyZWZyZXNoLScgKyBuYW1lKTtcclxuXHJcbiAgICAgICAgLy8gZGlzYWJsZSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5wcmV2aW91cy5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICB0aGlzLm5leHQucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblxyXG4gICAgICAgIC8vIGdldCBhIHBhZ2VcclxuICAgICAgICB0aGlzLnBhZ2VJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pdGVtc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemUgPz8gMjtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoLmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJldmlvdXMuY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleCAtIDE7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm5leHQuY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleCArIDE7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWQoKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsICsgJz9wYWdlSW5kZXg9JyArIHRoaXMucGFnZUluZGV4ICsgJyZjb3VudD0nICsgdGhpcy5wYWdlU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGlubmVyLnNob3coKTtcclxuICAgICAgICAvL2xldCBkID0gYXdhaXQgJC5nZXRKU09OKHVybCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9keS5sb2FkKHVybCwgKGQsIHN0YXR1cywgeGhyKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkIHx8IGQudHJpbSgpID09ICcnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclJvd3MoJ05vIGRhdGEnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5oaWRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlRGlzYWJsZUJ1dHRvbnMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIHRoaXMuc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgICAgdGhpcy5jbGVhclJvd3MoKTtcclxuXHJcbiAgICAgICAgJC5nZXRKU09OKHRoaXMudXJsQ291bnQsIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zQ291bnQgPSBkYXRhLmNvdW50O1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9KS5mYWlsKChlcnJvcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGVycm9yU3RyaW5nID0gZXJyb3IucmVzcG9uc2VKU09OID8gKGVycm9yLnJlc3BvbnNlSlNPTi5lcnJvciA/PyBlcnJvci5yZXNwb25zZUpTT04pIDogZXJyb3IucmVzcG9uc2VUZXh0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRGaXJzdFJvd1dhcm5pbmcoZXJyb3JTdHJpbmcpO1xyXG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZURpc2FibGVCdXR0b25zKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRmlyc3RSb3dXYXJuaW5nKHRleHQpIHtcclxuICAgICAgICB0aGlzLmJvZHkuY2hpbGRyZW4oJ3RyJykuYWRkQ2xhc3MoJ2JnLWRhbmdlcicpO1xyXG4gICAgICAgIHRoaXMuYm9keS5jaGlsZHJlbigndHInKS5jaGlsZHJlbigndGQnKS5hZGRDbGFzcygndGV4dC1saWdodCcpLmFwcGVuZCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclJvd3ModGV4dCkge1xyXG4gICAgICAgIGxldCBjb2x1bW5zQ291bnQgPSB0aGlzLmJvZHkucGFyZW50KCkuZmluZCgndGgnKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFjb2x1bW5zQ291bnQpXHJcbiAgICAgICAgICAgIGNvbHVtbnNDb3VudCA9IHRoaXMuYm9keS5wYXJlbnQoKS5maW5kKCd0cicpLmxlbmd0aDtcclxuICAgICAgICBpZiAoIWNvbHVtbnNDb3VudClcclxuICAgICAgICAgICAgY29sdW1uc0NvdW50ID0gMTtcclxuXHJcbiAgICAgICAgdGV4dCA9IHRleHQgPz8gJyZuYnNwOyc7XHJcblxyXG4gICAgICAgIHRoaXMuYm9keS5odG1sKCc8dHI+PHRkIGNvbHNwYW49JyArIGNvbHVtbnNDb3VudCArICc+JyArIHRleHQgKyAnPC90ZD48L3RyPicpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBlbmFibGVEaXNhYmxlQnV0dG9ucygpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFnZUluZGV4IDw9IDApXHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXMucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgICAgICBpZiAoKHRoaXMucGFnZUluZGV4ICsgMSkgKiB0aGlzLnBhZ2VTaXplID49IHRoaXMuaXRlbXNDb3VudClcclxuICAgICAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi9yb3V0ZXIuanNcIjtcclxuaW1wb3J0IHsgZG90bWltdGFibGUgfSBmcm9tIFwiLi4vZG90bWltdGFibGUuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGFkbWluUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuLi9oZWxwZXJzLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIjtcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcbmltcG9ydCB7IG1vZGFsUGFuZWxVc2VycyB9IGZyb20gXCIuLi9tb2RhbC9tb2RhbFBhbmVsVXNlcnMuanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBhZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRNZW1iZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0TWVtYmVyc1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9ICQoXCIjRW5naW5lVmlld19JZFwiKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUyID0gbmV3IGNvbnNvbGUyKCQoXCIjY29uc29sZVwiKSwgJCgnZGl2LmRvY2tpbmctZm9ybScpKTtcclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbiA9ICQoJyNsYXVuY2gnKTtcclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaWQgfHwgIXRoaXMuaWQudmFsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKFwiQ2FuJ3QgbGF1bmNoIGRlcGxveW1lbnQuIE5vIGVuZ2luZSByZXF1ZXN0IC4uLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzdWJzY3JpYmUgdG8gZXZlbnQgZnJvbSBzaWduYWxyIGFib3V0IGRlcGxveW1lbnRcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RhcnRlZCwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0YXJ0ZWQuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJSZWFkeSB0byBkZXBsb3kuXCIpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXHJcbiAgICAgICAgICAgIHRoaXMubGF1bmNoQnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0ZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RlZC4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RvcHBlZC5cIikpO1xyXG5cclxuICAgICAgICAvLyBKdXN0IGluIGNhc2UgaXQncyBub3Qgc3RhcnRlZCAoYnV0IHNob3VsZCBiZSBkb25lIGFscmVhZHkgZnJvbSBob21lUGFnZS5qcylcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gTGF1bmNoIGEgdmFsaWRhdGlvbiBiZWZvcmVcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSAkKFwiZm9ybVwiKS52YWxpZCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sYXVuY2hKb2JBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGxhdW5jaEpvYkFzeW5jKCkge1xyXG4gICAgICAgIHRoaXMuY29uc29sZTIuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiRGVwbG95bWVudCBzdGFydGVkLlwiKVxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pZCB8fCAhdGhpcy5pZC52YWwoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZFdhcm5pbmcoXCJDYW4ndCBsYXVuY2ggZGVwbG95bWVudC4gTm8gZW5naW5lIHJlcXVlc3QgLi4uXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIlNhdmluZyBkZXBsb3ltZW50IHByb3BlcnRpZXMuLi5cIik7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0LCBzYXZlIHRoZSBkZXBsb3ltZW50LlxyXG4gICAgICAgICAgICBhd2FpdCAkLnBvc3QoJycsICQoJ2Zvcm0nKS5zZXJpYWxpemUoKSk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihgVW5hYmxlIHRvIHNhdmUgZW5naW5lIGRldGFpbHNgKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QoZS5yZXNwb25zZUpTT04pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJXYWl0aW5nIGZvciBhbiBhZ2VudCB0byBlbnF1ZXVlIHRoZSBkZXBsb3ltZW50Li4uXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gdXJsIGZvciB0aGF0IHBhcnRpY3VsYXIgZGVwbG95bWVudFxyXG4gICAgICAgICAgICBsZXQgdXJsID0gYC9hcGkvZW5naW5lcy8ke3RoaXMuaWQudmFsKCl9L2RlcGxveWA7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihgPGI+RGVwbG95bWVudDwvYj4gJHt0aGlzLmlkLnZhbCgpfSBjYW4gbm90IGJlIGRlcGxveWVkLi4uYCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdChlcnJvckpzb24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVwbG95bWVudHN0YXJ0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95bWVudHN0YXJ0KVxyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBkZXBsb3kgZW5naW5lYCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KGUucmVzcG9uc2VKU09OKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uVW5sb2FkKCkge1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9mZihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQge1xyXG4gICAgbW9kYWxQYW5lbFVzZXJzLFxyXG4gICAgbW9kYWxQYW5lbERlbGV0ZUVuZ2luZSxcclxuICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLFxyXG4gICAgbW9kYWxQYW5lbERhdGFicmlja3MsXHJcbiAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnlcclxufSBmcm9tIFwiLi4vbW9kYWwvaW5kZXguanNcIjtcclxuXHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgYWRtaW5FbmdpbmVSZXF1ZXN0RGV0YWlsc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50TWVtYmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE1lbWJlcnNcIik7XHJcblxyXG4gICAgICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUuaW5pdGlhbGl6ZShcInBhbmVsRGVsZXRlRW5naW5lXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLmluaXRpYWxpemUoXCJwYW5lbFJlc291cmNlR3JvdXBcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFicmlja3MuaW5pdGlhbGl6ZShcInBhbmVsRGF0YWJyaWNrc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnkuaW5pdGlhbGl6ZShcInBhbmVsRGF0YUZhY3RvcnlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSAkKFwiI0lkXCIpO1xyXG5cclxuICAgICAgICBpZiAoJChcIiNjb25zb2xlXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyID0gbmV3IGNvbnNvbGUyKCQoXCIjY29uc29sZVwiKSwgJCgnZGl2LmRvY2tpbmctZm9ybScpKTtcclxuXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LmNvbm5lY3Rpb24uaW52b2tlKCdTdWJzY3JpYmVEZXBsb3ltZW50QXN5bmMnLCB0aGlzLmlkLnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu79cblxuZXhwb3J0IGNsYXNzIG1ndGxvYWRlciB7XG5cclxuXG4gICAgc3RhdGljIHNldE1ndFByb3ZpZGVyKCkge1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBtZ3QuUHJveHlQcm92aWRlcihcIi9hcGkvUHJveHlcIik7XG4gICAgICAgIHByb3ZpZGVyLmxvZ2luID0gKCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0FjY291bnQvU2lnbkluP3JlZGlyZWN0VXJpPScgKyB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgcHJvdmlkZXIubG9nb3V0ID0gKCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0FjY291bnQvU2lnbk91dCc7XG5cbiAgICAgICAgbWd0LlByb3ZpZGVycy5nbG9iYWxQcm92aWRlciA9IHByb3ZpZGVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbnRlcmNlcHRNZ3RMb2dpbigpIHtcbiAgICAgICAgdmFyIG1ndGxvZ2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21ndGxvZ2luJyk7XG5cbiAgICAgICAgLy8vLyBUaGVzZXMgZXZlbnRzIGFyZSByYWlzZWQgd2hlbiB1c2VyIGNsaWNrIG9uIGxvZ2luIG91ciBsb2dvdXQgYnV0dG9uXG4gICAgICAgIC8vLy8gVGhleXIgYXJlIG5vdCByYWlzZWQgYXQgdGhlIGdvb2QgdGltaW5nXG4gICAgICAgIC8vLy8gU2hvdWxkIGJlIHJlbmFtZWQgJ2xvZ2luQ2xpY2snIGFuZCAnbG9nb3V0Q2xpY2snXG4gICAgICAgIC8vbWd0bG9naW4uYWRkRXZlbnRMaXN0ZW5lcignbG9naW5Db21wbGV0ZWQnLCAoKSA9PiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJkZXRhaWxzXCIpKTtcbiAgICAgICAgLy9tZ3Rsb2dpbi5hZGRFdmVudExpc3RlbmVyKCdsb2dvdXRDb21wbGV0ZWQnLCAoKSA9PiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJkZXRhaWxzXCIpKTtcblxuICAgICAgICAvLy8vIGdldCBsb2NhbCBzdG9yYWdlIGl0ZW0gaWYgYW55XG4gICAgICAgIC8vdmFyIHVzZXJEZXRhaWxzRnJvbVN0b3JhZ2VTdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcmRldGFpbHMnKTtcblxuICAgICAgICAvL2lmICh1c2VyRGV0YWlsc0Zyb21TdG9yYWdlU3RyaW5nICE9PSBudWxsICYmIG1ndGxvZ2luLnVzZXJEZXRhaWxzID09PSBudWxsKVxuICAgICAgICAvLyAgICBtZ3Rsb2dpbi51c2VyRGV0YWlscyA9IEpTT04ucGFyc2UodXNlckRldGFpbHNGcm9tU3RvcmFnZVN0cmluZyk7XG5cbiAgICAgICAgLy8vLyBMb2FkaW5nIGNvbXBsZXRlZCBpcyBjb3JyZWN0bHkgZmlyZWQgQUZURVIgY29tcG9uZW50IGlzIGxvYWRlZCBBTkQgdXNlciBsb2dnZWQgaW5cbiAgICAgICAgLy9tZ3Rsb2dpbi5hZGRFdmVudExpc3RlbmVyKCdsb2FkaW5nQ29tcGxldGVkJywgKCkgPT4ge1xuICAgICAgICAvLyAgICBpZiAobWd0bG9naW4udXNlckRldGFpbHMgIT09IG51bGwpXG4gICAgICAgIC8vICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcmRldGFpbHMnLCBKU09OLnN0cmluZ2lmeShtZ3Rsb2dpbi51c2VyRGV0YWlscykpO1xuICAgICAgICAvL30pO1xuXG4gICAgfVxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBoYW5kbGVycyB9IGZyb20gXCIuL2hhbmRsZXJzLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBhdXRoIHtcclxuXHJcblxyXG5cdC8vIHNpbmdsZXRvblxyXG5cdHN0YXRpYyBfY3VycmVudDtcclxuXHJcblx0LyoqIEByZXR1cm5zIHthdXRofSAqL1xyXG5cdHN0YXRpYyBnZXQgY3VycmVudCgpIHtcclxuXHRcdGlmICghYXV0aC5fY3VycmVudClcclxuXHRcdFx0YXV0aC5fY3VycmVudCA9IG5ldyBhdXRoKCk7XHJcblxyXG5cdFx0cmV0dXJuIGF1dGguX2N1cnJlbnQ7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgT25BdXRoZW50aWNhdGVkID0gXCJPbkF1dGhlbnRpY2F0ZWRcIlxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuaGFuZGxlcnMgPSBuZXcgaGFuZGxlcnMoKTtcclxuXHJcblx0XHQvKiogQHR5cGUgYm9vbGVhbiAqL1xyXG5cdFx0dGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBnbG9iYWxVc2VyQXV0aGVudGljYXRlZDtcclxuXHR9XHJcblxyXG5cdGluaXRpYWxpemUoKSB7XHJcblxyXG5cdFx0JCgoKSA9PiB7XHJcblx0XHRcdC8vIGludm9rZSBhbGwgaGFuZGxlcnMgdG8gT25BdXRoZW50aWNhdGVkIHdpdGggdGhlIGNvcnJlY3QgdmFsdWVcclxuXHRcdFx0dGhpcy5oYW5kbGVycy5pbnZva2UoYXV0aC5PbkF1dGhlbnRpY2F0ZWQsIHRoaXMuaXNBdXRoZW50aWNhdGVkLCAnY29vbCcpXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdG9uKG1ldGhvZE5hbWUsIG5ld01ldGhvZCkge1xyXG5cdFx0dGhpcy5oYW5kbGVycy5vbihtZXRob2ROYW1lLCBuZXdNZXRob2QpO1xyXG5cdH1cclxuXHJcblx0b2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCkge1xyXG5cdFx0dGhpcy5oYW5kbGVycy5vZmYobWV0aG9kTmFtZSwgbWV0aG9kKTtcclxuXHR9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi4vbW9kYWwvbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCI7XHJcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi4vYXV0aC5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgaG9tZVBhZ2Uge1xyXG5cclxuICAgIC8vIHNpbmdsZXRvblxyXG4gICAgc3RhdGljIF9jdXJyZW50O1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7aG9tZVBhZ2V9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGN1cnJlbnQoKSB7XHJcbiAgICAgICAgaWYgKCFob21lUGFnZS5fY3VycmVudClcclxuICAgICAgICAgICAgaG9tZVBhZ2UuX2N1cnJlbnQgPSBuZXcgaG9tZVBhZ2UoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhvbWVQYWdlLl9jdXJyZW50O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgICQoYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5vbkxvYWQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIG5vdGlmaWNhdGlvbiBtb2RhbFxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbCA9IG5ldyBtb2RhbFBhbmVsKFwibm90aWZcIikuc20oKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBhdXRvIGJpbmQgd2l0aCBhcnJvdyBmdW5jdGlvblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICAvLyBtYW51YWwgYmluZGluZyBmb3IgZnVuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLm9uU2hvdyh0aGlzLnNob3dQYW5lbC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsID0gbmV3IG1vZGFsUGFuZWwoXCJzZXR0aW5nc1wiKS5sZygpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5vblNob3duKGUgPT4gdGhpcy5zaG93blNldHRpbmdzUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkU2V0dGluZ3NQYW5lbChlKSk7XHJcblxyXG5cclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IGF3YWl0IGNvbnNvbGUubG9nKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZywgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG4gICAgICAgIC8vIHdoZW4gcmVjZWl2aW5nIGFuIG9yZGVyIHRvIHJlZnJlc2ggbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKCdyZWZyZXNoX25vdGlmaWNhdGlvbnMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbCB0byByZWZyZXNoX25vdGlmaWNhdGlvbnNcIik7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGF1dGguY3VycmVudC5pc0F1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwic2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGgtbGFyZ2VcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFib3V0ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlNvbWV0aGluZyBpbnRlcmVzdGluZyBsaWtlLi4uIEhleSwgdGhpcyBpcyBhIHBpZWNlIG9mIE9TUyBwcm9qZWN0LCBtYWRlIGJ5IFNlYmFzdGllbiBQZXJ0dXM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY29nc1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdCBFbmdpbmUgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPiAgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cIm10LTJcIiBkYXRhLXN0eWxlPVwiYnRuLW91dGxpbmUtZGFya1wiIGRhdGEtY29udGFpbmVyPVwiYm9keVwiIGRhdGEtbGl2ZS1zZWFyY2g9XCJ0cnVlXCIgdGl0bGU9XCJDaG9vc2UgZGVmYXVsdCBlbmdpbmVcIiBpZD1cImRlZmF1bHRFbmdpbmVTZWxlY3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5NdXN0YXJkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+S2V0Y2h1cDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlJlbGlzaDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgYCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjZGVmYXVsdEVuZ2luZVNlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuIFxyXG5cclxuICAgICAgICBhdXRoLmN1cnJlbnQub24oYXV0aC5PbkF1dGhlbnRpY2F0ZWQsIGFzeW5jIGlzQXV0aCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc0F1dGgpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hOb3RpZmljYXRpb25zQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZGlzbWlzc05vdGlmaWNhdGlvbnNBc3luYygpIHtcclxuXHJcbiAgICAgICAgLy8gbG9hZGluZyBub3RpZmljYXRpb25zXHJcbiAgICAgICAgbGV0IHVybCA9IFwiL2FwaS9ub3RpZmljYXRpb25zXCI7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1ldGhvZDogXCJERUxFVEVcIiB9KTtcclxuXHJcbiAgICAgICAgdmFyIGRlbGV0ZWQgPSByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmICghZGVsZXRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hOb3RpZmljYXRpb25zQXN5bmMoKSB7XHJcblxyXG4gICAgICAgIC8vIGxvYWRpbmcgbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIGxldCB1cmwgPSBcIi9hcGkvbm90aWZpY2F0aW9uc1wiO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICBsZXQgYmVsbENvbnRlbnQgPSAkKCcjbm90aWYtYmVsbC1jb250ZW50Jyk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5ub3RpZmljYXRpb25zIHx8IHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPD0gMCkge1xyXG5cclxuICAgICAgICAgICAgYmVsbENvbnRlbnQuaGlkZSgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuYXBwZW5kKGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLWVtcHR5LWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFyIGZhLWJlbGxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+Tm8gbmV3IG5vdGlmaWNhdGlvbnMsIHlldC48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgYmVsbENvbnRlbnQuc2hvdygpO1xyXG4gICAgICAgICAgICBiZWxsQ29udGVudC50ZXh0KHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGgudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBub3RpZiBvZiB0aGlzLm5vdGlmaWNhdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbm90aWZVcmwgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmIChub3RpZi51cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgbm90aWZVcmwgPSBgPGEgaHJlZj1cIiR7bm90aWYudXJsfVwiIGNsYXNzPVwibWwtMiBoaWRlLXNtXCI+PGkgY2xhc3M9XCJmYXMgZmEtZXh0ZXJuYWwtbGluay1hbHRcIj48L2k+PC9hPmA7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrLWNpcmNsZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7bm90aWYudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLW1lc3NhZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7bm90aWYubWVzc2FnZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke25vdGlmVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RpdiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXYgPiBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG4gICAgICAgIHZhciB0eXBlID0gYnV0dG9uLmRhdGEoJ3R5cGUnKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93blNldHRpbmdzUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkU2V0dGluZ3NQYW5lbChldmVudCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmRlbGV0ZUJ1dHRvblRleHQoXCJEaXNtaXNzIG5vdGlmaWNhdGlvbnNcIik7XHJcblxyXG4gICAgICAgIGlmICghYXV0aC5jdXJyZW50LmlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmFwcGVuZChgXHJcbiAgICAgICAgICAgICAgICAgICAgPCBkaXYgY2xhc3M9IFwibm90aWYtZW1wdHlcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLWVtcHR5LWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtYmVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5QbGVhc2UgbG9nIGluIHRvIHNlZSBub3RpZmljYXRpb25zIGhlcmUuPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2ID4gYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuZGVsZXRlQnV0dG9uKCkuY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNtaXNzTm90aWZpY2F0aW9uc0FzeW5jKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3Mgc2V0dGluZ3NQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/ZXhwb3J0IGZ1bmN0aW9uIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKCRlbmdpbmVzVGFibGUsIHVybCwgY2hlY2tlZCwgb25Qb3N0Qm9keSwgb25DaGVja1Jvdykge1xyXG5cclxuXHJcbiAgICBsZXQgb25DaGVjayA9IGNoZWNrZWQgPyBvbkNoZWNrUm93IDogKCkgPT4geyB9O1xyXG4gICAgbGV0IG9uQ2xpY2sgPSBjaGVja2VkID8gKCkgPT4geyB9OiBvbkNoZWNrUm93O1xyXG5cclxuICAgIGxldCBjb2x1bW5zID0gW107XHJcbiAgICBpZiAoY2hlY2tlZClcclxuICAgICAgICBjb2x1bW5zLnB1c2goe1xyXG4gICAgICAgICAgICBmaWVsZDogJ2VuZ2luZUlkJyxcclxuICAgICAgICAgICAgcmFkaW86IHRydWUsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICBjb2x1bW5zLnB1c2goe1xyXG4gICAgICAgIGZpZWxkOiAnZW5naW5lVHlwZUpzb24nLFxyXG4gICAgICAgIHRpdGxlOiAnVHlwZScsXHJcbiAgICAgICAgd2lkdGg6ICc4MCcsXHJcbiAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIHNlYXJjaEZvcm1hdHRlcjogZmFsc2UsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIHJvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9J3N2Zy0yMngyMi1pY29uJz48ZGl2IGNsYXNzPSdzdmctaWNvbiAke3ZhbHVlLmVuZ2luZVR5cGVJY29uU3RyaW5nfSc+PC9kaXY+PC9kaXY+YDtcclxuICAgICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgICAgZmllbGQ6ICdzdGF0dXNKc29uJyxcclxuICAgICAgICB0aXRsZTogJ1N0YXR1cycsXHJcbiAgICAgICAgd2lkdGg6ICc4MCcsXHJcbiAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIHNlYXJjaEZvcm1hdHRlcjogZmFsc2UsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIHJvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxpIGNsYXNzPVwiJHt2YWx1ZS5zdGF0dXNJY29ufVwiIHRpdGxlPScke3ZhbHVlLnN0YXR1c1N0cmluZ30nIHN0eWxlPVwiY29sb3I6JHt2YWx1ZS5zdGF0dXNDb2xvcn07d2lkdGg6MjBweDtcIj48L2k+YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwge1xyXG4gICAgICAgIGZpZWxkOiAnZW5naW5lTmFtZScsXHJcbiAgICAgICAgdGl0bGU6ICdOYW1lJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPHN0cm9uZz4ke3ZhbHVlfTwvc3Ryb25nPmA7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgc2VhcmNoOiBmYWxzZSxcclxuICAgICAgICBzaG93UmVmcmVzaDogZmFsc2UsXHJcbiAgICAgICAgc2hvd1RvZ2dsZTogZmFsc2UsXHJcbiAgICAgICAgY2hlY2tib3hIZWFkZXI6IGZhbHNlLFxyXG4gICAgICAgIGNsaWNrVG9TZWxlY3Q6IHRydWUsXHJcbiAgICAgICAgcGFnaW5hdGlvbjogZmFsc2UsXHJcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmdUZW1wbGF0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gJzxpIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLWZ3IGZhLTJ4XCI+PC9pPic7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxyXG4gICAgICAgIG9uUG9zdEJvZHk6IG9uUG9zdEJvZHksXHJcbiAgICAgICAgb25DaGVjazogb25DaGVjayxcclxuICAgICAgICBvbkNsaWNrUm93OiBvbkNsaWNrLFxyXG4gICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gXCJZb3UgZG9uJ3QgaGF2ZSBhbnkgcnVubmluZyBlbmdpbmUuIFBsZWFzZSA8YSBocmVmPScvRW5naW5lcy9JbmRleCc+Y2hlY2sgeW91ciBlbmdpbmVzIHN0YXR1cy48L2E+IFwiOyB9XHJcbiAgICB9KTtcclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZGF0YVNvdXJjZXNQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBnZXQgdGFibGVcclxuICAgICAgICB0aGlzLmVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgZW5naW5lIHRhYmxlXHJcbiAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKHRoaXMuJGVuZ2luZXNUYWJsZSwgXCIvZGF0YVNvdXJjZXMvaW5kZXgvZW5naW5lc1wiLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5vblBvc3RCb2R5KGRhdGEpLFxyXG4gICAgICAgICAgICAocm93KSA9PiB0aGlzLm9uQ2xpY2tSb3cocm93KSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZSA9ICQoXCIjZGF0YVNvdXJjZXNUYWJsZVwiKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICBmb3JtYXROb01hdGNoZXM6ICgpID0+IHsgcmV0dXJuICdQbGVhc2Ugc2VsZWN0IGEgcnVubmluZyBlbmdpbmUgdG8gc2VlIGFsbCBkYXRhIHNvdXJjZXMgYXZhaWxhYmxlLic7IH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLm9uKCdjbGljay1yb3cuYnMudGFibGUnLCAocm93LCAkZWxlbWVudCwgZmllbGQpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgL0RhdGFTb3VyY2VzL0VkaXQvJHt0aGlzLmVuZ2luZS5pZH0vJHskZWxlbWVudC5uYW1lfWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Qb3N0Qm9keShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZSA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25DbGlja1Jvdyhyb3cpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSByb3c7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkRGF0YVNvdXJjZXNBc3luYyh0aGlzLmVuZ2luZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGxvYWREYXRhU291cmNlc0FzeW5jKGVuZ2luZSkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3Nob3dMb2FkaW5nJyk7XHJcbiAgICAgICAgbGV0IGRhdGFfdXJsID0gYC9kYXRhU291cmNlcy9pbmRleC9kYXRhU291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZS5pZH1gO1xyXG4gICAgICAgIGxldCBkYXRhU291cmNlc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goZGF0YV91cmwpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBhd2FpdCBkYXRhU291cmNlc1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRhdGFTb3VyY2VzKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFTb3VyY2VzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgndXBkYXRlRm9ybWF0VGV4dCcsICdmb3JtYXROb01hdGNoZXMnLFxyXG4gICAgICAgICAgICBgTm8gZGF0YSBzb3VyY2VzIGZvciBlbmdpbmUgPHN0cm9uZz4ke2VuZ2luZS5lbmdpbmVOYW1lfTwvc3Ryb25nPi4gPGEgaHJlZj0nL2RhdGFTb3VyY2VzL25ldyc+Q3JlYXRlIGEgbmV3IGRhdGEgc291cmNlPC9hPiBmb3IgeW91ciBlbmdpbmVgKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdsb2FkJywgdGhpcy5kYXRhU291cmNlcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnaGlkZUxvYWRpbmcnKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlIH0gZnJvbSBcIi4uL2Jvb3RzdHJhcFRhYmxlcy9pbmRleC5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGh0bWxGaWVsZFByZWZpeCwgZW5naW5lVXJsKSB7XHJcblxyXG4gICAgICAgIC8vIEh0bWxGaWVsZFByZWZpeCBwcmVmaXggaXMgdGhlIHByZWRpeCBmb3IgcmVuZGVyaW5nIGFzcC5uZXQgY29yZSBpdGVtc1xyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gYCR7aHRtbEZpZWxkUHJlZml4fV9gO1xyXG5cclxuICAgICAgICAvLyB1cmwgZm9yIGxvYWRpbmcgZW5naW5lc1xyXG4gICAgICAgIHRoaXMuZW5naW5lVXJsID0gZW5naW5lVXJsO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvLyBnZXQgZm9ybVxyXG4gICAgICAgIHRoaXMuJGZvcm0gPSAkKFwiZm9ybVwiKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGVuZ2luZSB0YWJsZVxyXG4gICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgc3Bpbm5lclxyXG4gICAgICAgIHRoaXMuJHNwaW5uZXIgPSAkKFwiI3NwaW5uZXJcIilcclxuXHJcbiAgICAgICAgLy8gZ2V0IGJ1dHRvbnNcclxuICAgICAgICB0aGlzLiRuZXh0QnV0dG9uID0gJChcIiNuZXh0QnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuJHByZXZpb3VzQnV0dG9uID0gJChcIiNwcmV2aW91c0J1dHRvblwiKTtcclxuICAgICAgICB0aGlzLiRzYXZlQnV0dG9uID0gJChcIiNzYXZlQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgd2l6YXJkXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQgPSAkKFwiI3NtYXJ0V2l6YXJkXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgcHJvcGVydGllcyBwYW5lbFxyXG4gICAgICAgIHRoaXMuJHByb3BlcnRpZXMgPSAkKFwiI3Byb3BlcnRpZXNcIik7XHJcblxyXG4gICAgICAgIC8vIGhpZGRlbiBmaWVsZHNcclxuICAgICAgICB0aGlzLiRlbmdpbmVJZEVsZW1lbnQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1FbmdpbmVJZGApO1xyXG4gICAgICAgIHRoaXMuJGlzTmV3ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9SXNOZXdgKTtcclxuXHJcbiAgICAgICAgLy8gTm8gcHJlZml4IGZvciBoaWRkZW50IFN0ZXAgZmllbGQsIHNpbmNlIGl0J3MgZGlyZWN0bHkgYmluZGVkIGludG8gdGhlIFBhZ2VNb2RlbFxyXG4gICAgICAgIHRoaXMuJHN0ZXAgPSAkKGAjU3RlcGApO1xyXG5cclxuICAgICAgICB0aGlzLnN0ZXAgPSB0aGlzLiRzdGVwICAmJiB0aGlzLiRzdGVwLnZhbCgpID8gcGFyc2VJbnQodGhpcy4kc3RlcC52YWwoKSkgOiAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kc3Bpbm5lcilcclxuICAgICAgICAgICAgdGhpcy4kc3Bpbm5lci5oaWRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9vc3RyYXBFbmdpbmVzVGFibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib290c3RyYXBXaXphcmQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib290c3RyYXBCdXR0b25zKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGJvb3RzdHJhcFdpemFyZCgpIHtcclxuXHJcbiAgICAgICAgLy8gU3RlcCBzaG93IGV2ZW50XHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQub24oXCJzaG93U3RlcFwiLCBhc3luYyAoZSwgYW5jaG9yT2JqZWN0LCBzdGVwTnVtYmVyLCBzdGVwRGlyZWN0aW9uLCBzdGVwUG9zaXRpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBzdGVwXHJcbiAgICAgICAgICAgIHRoaXMuJHN0ZXAudmFsKHN0ZXBOdW1iZXIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJHNhdmVCdXR0b24uZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gXCJmaXJzdFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcImxhc3RcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzYXZlQnV0dG9uLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYm9vdHN0cmFwIHdpemFyZFxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc3RlcCxcclxuICAgICAgICAgICAgdGhlbWU6ICdkb3RzJywgLy8gdGhlbWUgZm9yIHRoZSB3aXphcmQsIHJlbGF0ZWQgY3NzIG5lZWQgdG8gaW5jbHVkZSBmb3Igb3RoZXIgdGhhbiBkZWZhdWx0IHRoZW1lXHJcbiAgICAgICAgICAgIGF1dG9BZGp1c3RIZWlnaHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRWZmZWN0IG9uIG5hdmlnYXRpb24sIG5vbmUvZmFkZS9zbGlkZS1ob3Jpem9udGFsL3NsaWRlLXZlcnRpY2FsL3NsaWRlLXN3aW5nXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJzIwMCcsIC8vIFRyYW5zaW9uIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnJyAvLyBUcmFuc2l0aW9uIGFuaW1hdGlvbiBlYXNpbmcuIE5vdCBzdXBwb3J0ZWQgd2l0aG91dCBhIGpRdWVyeSBlYXNpbmcgcGx1Z2luXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuYWJsZVVSTGhhc2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB0b29sYmFyU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJQb3NpdGlvbjogJ25vbmUnLCAvLyBub25lLCB0b3AsIGJvdHRvbSwgYm90aFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvblBvc2l0aW9uOiAncmlnaHQnLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXHJcbiAgICAgICAgICAgICAgICBzaG93TmV4dEJ1dHRvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBhIE5leHQgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBzaG93UHJldmlvdXNCdXR0b246IGZhbHNlLCAvLyBzaG93L2hpZGUgYSBQcmV2aW91cyBidXR0b25cclxuICAgICAgICAgICAgICAgIHRvb2xiYXJFeHRyYUJ1dHRvbnM6IFtdIC8vIEV4dHJhIGJ1dHRvbnMgdG8gc2hvdyBvbiB0b29sYmFyLCBhcnJheSBvZiBqUXVlcnkgaW5wdXQvYnV0dG9ucyBlbGVtZW50c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBrZXlib2FyZFNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBrZXlOYXZpZ2F0aW9uOiBmYWxzZSwgLy8gRW5hYmxlL0Rpc2FibGUga2V5Ym9hcmQgbmF2aWdhdGlvbihsZWZ0IGFuZCByaWdodCBrZXlzIGFyZSB1c2VkIGlmIGVuYWJsZWQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uQ2hlY2tSb3cocm93LCAkZWxlbWVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLiRlbmdpbmVJZEVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwocm93LmlkKTtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoIWRhdGE/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0QnV0dG9uLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudCAmJiB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gZGF0YS5maW5kSW5kZXgoZSA9PiBlLmlkID09PSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCBzZWxlY3RlZEluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgcmFkaW8gaW5wdXRzIGJ1dHRvbnMgdG8gYWRkIGEgdmFsaWRhdGlvbiBydWxlIG9uIHRoZW1cclxuICAgICAgICBsZXQgJGJ0U2VsZWN0SXRlbSA9ICQoJ2lucHV0W25hbWU9XCJidFNlbGVjdEl0ZW1cIl0nKTtcclxuXHJcbiAgICAgICAgJGJ0U2VsZWN0SXRlbS5ydWxlcyhcImFkZFwiLCB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwiWW91IHNob3VsZCBzZWxlY3QgYW4gZW5naW5lIGJlZm9yZSBnb2luZyBuZXh0IHN0ZXAuXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYm9vc3RyYXBFbmdpbmVzVGFibGUoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZW5naW5lc1RhYmxlIHx8ICF0aGlzLmVuZ2luZVVybClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsIHRoaXMuZW5naW5lVXJsLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5lbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3csICRlbGVtZW50KSA9PiB0aGlzLmVuZ2luZVRhYmxlT25DaGVja1Jvdyhyb3csICRlbGVtZW50KSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJvb3RzdHJhcEJ1dHRvbnMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRwcmV2aW91c0J1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwicHJldlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRuZXh0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRm9ybSgpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcIm5leHRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YWxpZGF0ZUZvcm0oKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZm9ybSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gdGhpcy4kZm9ybS52YWxpZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWlzVmFsaWQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbGlkYXRvciA9IHRoaXMuJGZvcm0udmFsaWRhdGUoKTtcclxuICAgICAgICB2YWxpZGF0b3IucmVzZXRGb3JtKCk7XHJcblxyXG4gICAgICAgIGxldCBzdW1tYXJ5ID0gdGhpcy4kZm9ybS5maW5kKFwiLnZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIik7XHJcblxyXG4gICAgICAgIGlmIChzdW1tYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gc3VtbWFyeS5maW5kKFwidWxcIik7XHJcbiAgICAgICAgICAgIGlmIChsaXN0KVxyXG4gICAgICAgICAgICAgICAgbGlzdC5lbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVTcWwge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2RhdGFTb3VyY2VzL25ldy9wcm9wZXJ0aWVzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmR2dD1BenVyZVNxbERhdGFiYXNlYCk7XHJcblxyXG4gICAgICAgIC8vIEdldHRpbmcgdGVzdCBidXR0b25cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbiA9ICQoXCIjZGF0YVNvdXJjZVRlc3RCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmNsaWNrKGFzeW5jIChldnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSAkKFwiI0RhdGFTb3VyY2VWaWV3X0VuZ2luZUlkXCIpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke2VuZ2luZUlkfS90ZXN0YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2RhdGFTb3VyY2VzL25ldy9wcm9wZXJ0aWVzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmR2dD1BenVyZUJsb2JGU2ApO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCLvu79leHBvcnQgY2xhc3MgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2RhdGFTb3VyY2VzL25ldy9wcm9wZXJ0aWVzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmR2dD1Db3Ntb3NEYmApO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsIu+7v2V4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGVuZ2luZUlkLCBodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUF6dXJlQmxvYlN0b3JhZ2VgKTtcclxuXHJcblxyXG4gICAgICAgIC8vIEdldHRpbmcgdGVzdCBidXR0b25cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbiA9ICQoXCIjZGF0YVNvdXJjZVRlc3RCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmNsaWNrKGFzeW5jIChldnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSAkKFwiI0RhdGFTb3VyY2VWaWV3X0VuZ2luZUlkXCIpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke2VuZ2luZUlkfS90ZXN0YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHdpemFyZFBhZ2UgfSBmcm9tICcuLi93aXphcmQvaW5kZXguanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVTcWwgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZVNxbC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVDb3Ntb3NEYiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlQmxvYlN0b3JhZ2UuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VOZXcgZXh0ZW5kcyB3aXphcmRQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcignRGF0YVNvdXJjZVZpZXcnLCAnL2RhdGFTb3VyY2VzL25ldy9lbmdpbmVzJylcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwgPSBuZXcgZGF0YVNvdXJjZUF6dXJlU3FsKCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyID0gbmV3IGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIoKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZUNvc21vc0RiID0gbmV3IGRhdGFTb3VyY2VBenVyZUNvc21vc0RiKCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSA9IG5ldyBkYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSgpO1xyXG4gICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9ICcnO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgLy8gY2FsbCBiYXNlIG9uTG9hZCBtZXRob2RcclxuICAgICAgICBzdXBlci5vbkxvYWQoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLm9uKFwic3RlcENvbnRlbnRcIiwgYXN5bmMgKGUsIGFuY2hvck9iamVjdCwgc3RlcE51bWJlciwgc3RlcERpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3RlcE51bWJlciA9PSAyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kc3Bpbm5lcj8uc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiRlbmdpbmVJZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVuZ2luZUlkID0gdGhpcy4kZW5naW5lSWRFbGVtZW50LnZhbCgpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVuZ2luZUlkPy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHNlbGVjdGlvbiBmcm9tIGRhdGEgc291cmNlcyB0eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJChgaW5wdXRbbmFtZT1cIkRhdGFTb3VyY2VWaWV3LkRhdGFTb3VyY2VUeXBlXCJdOmNoZWNrZWRgKS52YWwoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0VHlwZVNlbGVjdGVkID09PSB0eXBlLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSB0eXBlLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2F6dXJlc3FsZGF0YWJhc2UnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2F6dXJlc3FsZHcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2F6dXJlYmxvYmZzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMi5sb2FkQXN5bmMoZW5naW5lSWQsIHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnYXp1cmVibG9ic3RvcmFnZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdjb3Ntb3NkYicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZUNvc21vc0RiLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXI/LmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vYXN5bmMgdGVzdENvbm5lY3Rpb25Bc3luYyhldnQpIHtcclxuXHJcbiAgICAvLyAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnRleHQoXCJcIik7XHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnJlbW92ZUNsYXNzKCk7XHJcblxyXG4gICAgLy8gICAgdGhpcy5idG5UZXN0Q29ubmVjdGlvbi5kaXNhYmxlKCk7XHJcblxyXG4gICAgLy8gICAgLy8gdXJsIGZvciB0aGF0IHBhcnRpY3VsYXIgZGVwbG95bWVudFxyXG4gICAgLy8gICAgbGV0IHVybCA9IGAvYXBpL2RhdGFTb3VyY2VzL3NxbGNvbm5lY3Rpb24vdGVzdGA7XHJcblxyXG4gICAgLy8gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAvLyAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAvLyAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjb25uZWN0aW9uOiB0aGlzLmNvbm5lY3Rpb25TdHJpbmcudmFsKCkgfSksXHJcbiAgICAvLyAgICAgICAgaGVhZGVyczoge1xyXG4gICAgLy8gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgLy8gICAgICAgIH1cclxuICAgIC8vICAgIH0pO1xyXG5cclxuICAgIC8vICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAvLyAgICAgICAgdmFyIGVycm9ySnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgLy8gICAgICAgIGF3YWl0IHRoaXMubGJsVGVzdENvbm5lY3Rpb24udGV4dChlcnJvckpzb24uZXJyb3IpXHJcbiAgICAvLyAgICB9XHJcblxyXG4gICAgLy8gICAgdmFyIHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAvLyAgICBpZiAocmVzdWx0LnJlc3VsdCkge1xyXG4gICAgLy8gICAgICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24uYWRkQ2xhc3MoXCJ0ZXh0LXN1Y2Nlc3MgbWwtMlwiKTtcclxuICAgIC8vICAgICAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLmh0bWwoXCI8aSBjbGFzcz0nZmFzIGZhLWNoZWNrLWNpcmNsZSc+PC9pPiAgQ29ubmVjdGlvbiBzdWNjZXNzZnVsXCIpO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5hZGRDbGFzcyhcInRleHQtZGFuZ2VyIG1sLTJcIik7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5odG1sKFwiPGkgY2xhc3M9J2ZhcyBmYS1leGNsYW1hdGlvbi1jaXJjbGUnPjwvaT4gIENhbid0IGNvbm5lY3QgdG8gdGhlIHNvdXJjZSB1c2luZyB0aGlzIGNvbm5lY3Rpb24gc3RyaW5nXCIpO1xyXG4gICAgLy8gICAgfVxyXG5cclxuICAgIC8vICAgIHRoaXMuYnRuVGVzdENvbm5lY3Rpb24uZW5hYmxlKCk7XHJcbiAgICAvL31cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyB3aXphcmRQYWdlIH0gZnJvbSAnLi4vd2l6YXJkL2luZGV4LmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlU3FsIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVTcWwuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlRWRpdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gJChcIiNEYXRhU291cmNlVmlld19FbmdpbmVJZFwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24gPSAkKFwiI2RhdGFTb3VyY2VUZXN0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24ubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke3RoaXMuZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICBsZXQganNvbk9iamVjdFN0cmluZyA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfSnNvblN0cmluZ1wiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKGpzb25PYmplY3RTdHJpbmcgJiYganNvbk9iamVjdFN0cmluZy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvID0gSlNPTi5wYXJzZShqc29uT2JqZWN0U3RyaW5nKTtcclxuICAgICAgICAgICAgbGV0IGpzb25TdHJpbmcgPSBQcmlzbS5oaWdobGlnaHQoSlNPTi5zdHJpbmdpZnkobywgbnVsbCwgMiksIFByaXNtLmxhbmd1YWdlcy5qc29uLCAnanNvbicpO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzb3VyY2VDb2RlKVxyXG4gICAgICAgICAgICAgICAgJHNvdXJjZUNvZGUuaHRtbChqc29uU3RyaW5nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Qb3N0Qm9keShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsaWNrUm93KHJvdykge1xyXG4gICAgICAgIHRoaXMuZW5naW5lID0gcm93O1xyXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZEVudGl0aWVzQXN5bmModGhpcy5lbmdpbmUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIGdldCB0YWJsZVxyXG4gICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuJGVuZ2luZXNUYWJsZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsICcvZW50aXRpZXMvaW5kZXgvZW5naW5lcycsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLm9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3cpID0+IHRoaXMub25DbGlja1Jvdyhyb3cpKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZSA9ICQoXCIjZW50aXRpZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gJ1BsZWFzZSBzZWxlY3QgYSBydW5uaW5nIGVuZ2luZSB0byBzZWUgYWxsIHRoZSBlbnRpdGllcy4nOyB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUub24oJ2NsaWNrLXJvdy5icy50YWJsZScsIChyb3csICRlbGVtZW50LCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvRW50aXRpZXMvRGV0YWlscy8ke3RoaXMuZW5naW5lLmlkfS8keyRlbGVtZW50Lm5hbWV9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiBcclxuXHJcblxyXG4gICAgYXN5bmMgbG9hZEVudGl0aWVzQXN5bmMoZW5naW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3Nob3dMb2FkaW5nJyk7XHJcbiAgICAgICAgbGV0IGRhdGFfdXJsID0gYC9lbnRpdGllcy9pbmRleC9lbnRpdGllcz9lbmdpbmVJZD0ke2VuZ2luZS5pZH1gO1xyXG4gICAgICAgIGxldCBlbnRpdGllc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goZGF0YV91cmwpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBhd2FpdCBlbnRpdGllc1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmVudGl0aWVzKVxyXG4gICAgICAgICAgICB0aGlzLmVudGl0aWVzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3VwZGF0ZUZvcm1hdFRleHQnLCAnZm9ybWF0Tm9NYXRjaGVzJyxcclxuICAgICAgICAgICAgYE5vIGVudGl0aWVzIGZvciBlbmdpbmUgPHN0cm9uZz4ke2VuZ2luZS5lbmdpbmVOYW1lfTwvc3Ryb25nPi4gPGEgaHJlZj0nL2VudGl0aWVzL25ldyc+Q3JlYXRlIGEgbmV3IGVudGl0eTwvYT4gZm9yIHlvdXIgZW5naW5lYCk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2xvYWQnLCB0aGlzLmVudGl0aWVzKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnaGlkZUxvYWRpbmcnKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIG9uVW5Mb2FkKCkge1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsLCBtb2RhbFBhbmVsRXJyb3IgfSBmcm9tICcuLi9tb2RhbC9pbmRleCc7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNBenVyZVNxbCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmdpbmVJZFxyXG4gICAgICovXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50LCBlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PUF6dXJlU3FsVGFibGUmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGVycm9ycyBsYWJlbHNcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMgPSAkKFwiI2xhYmVsRXJyb3JEYXRhU291cmNlc1wiKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yVGFibGVzID0gJChcIiNsYWJlbEVycm9yVGFibGVzXCIpO1xyXG5cclxuICAgICAgICAvLyBvbmNlIGxvYWRlZCwgZ2V0IHRoZSBzZWxlY3RvcnNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0l0ZW1zU3RyaW5nYCk7XHJcbiAgICAgICAgLy8gb24gZGF0YSBzb3VyY2VzIGNoYW5nZXMsIHJlZnJlc2ggdGhlIHRhYmxlc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmNoYW5nZShhc3luYyAoKSA9PiB7IGF3YWl0IHRoaXMucmVmcmVzaFRhYmxlc0FzeW5jKGVuZ2luZUlkKSB9KTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0U3RyaW5nID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVzSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICAvLyBvbiB0YWJsZSBjaGFuZ2UsIHNldCB0aGUgY29ycmVjdCBhdHRyaWJ1dGVzIGZvciB0aGUgcHJldmlldyBidXR0b25cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuY2hhbmdlKCgpID0+IHsgdGhpcy5zZXRQcmV2aWV3RGF0YUF0dHJpYnV0ZXMoZW5naW5lSWQpIH0pO1xyXG5cclxuICAgICAgICB0aGlzLiRkZWx0YVBhbmVsID0gJChgI2RlbHRhUGFuZWxgKTtcclxuXHJcbiAgICAgICAgdGhpcy4kbW9kZSA9ICQoYGlucHV0W25hbWU9XCIke3RoaXMuaHRtbEZpZWxkUHJlZml4LnJlcGxhY2UoXCJfXCIsIFwiXCIpfS5Nb2RlXCJdOmNoZWNrZWRgKS52YWwoKTtcclxuICAgICAgICB0aGlzLmhpZGVPclNob3dEZWx0YVBhbmVsKCk7ICAgIFxyXG5cclxuICAgICAgICAkKGBpbnB1dFtuYW1lPVwiJHt0aGlzLmh0bWxGaWVsZFByZWZpeC5yZXBsYWNlKFwiX1wiLCBcIlwiKX0uTW9kZVwiXWApLmNoYW5nZSgoKSA9PiB7dGhpcy5oaWRlT3JTaG93RGVsdGFQYW5lbCgpfSk7XHJcblxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZU9yU2hvd0RlbHRhUGFuZWwoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJG1vZGUgPSAkKGBpbnB1dFtuYW1lPVwiJHt0aGlzLmh0bWxGaWVsZFByZWZpeC5yZXBsYWNlKFwiX1wiLCBcIlwiKX0uTW9kZVwiXTpjaGVja2VkYCkudmFsKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRtb2RlID09PSBcIkRlbHRhXCIpIHtcclxuICAgICAgICAgICAgdGhpcy4kZGVsdGFQYW5lbC5zaG93KFwiZmFzdFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiRkZWx0YVBhbmVsLmhpZGUoXCJmYXN0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpIHtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBEYXRhIFNvdXJjZXMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzVXJsID0gYC9lbnRpdGllcy9uZXcvZGF0YXNvdXJjZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZGF0YVNvdXJjZVR5cGU9QXp1cmVTcWxEYXRhYmFzZWA7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGRhdGFTb3VyY2VzVXJsKTtcclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzSnNvbiA9IGF3YWl0IHIuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlc0pzb24ubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFkYXRhU291cmNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiTm8gRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoZGF0YVNvdXJjZXMuam9pbigpKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGFTb3VyY2VTZWxlY3RlZClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaFRhYmxlc0FzeW5jKGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yRGF0YVNvdXJjZXNcIiwgZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJsb2FkaW5nIHRhYmxlcyAuLi5cIik7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuICAgICAgICBsZXQgdGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IHRhYmxlc1VybCA9IGAvYXBpL0F6dXJlU3FsRGF0YWJhc2UvJHtlbmdpbmVJZH0vJHtkYXRhU291cmNlU2VsZWN0ZWR9L3RhYmxlc2A7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCBmZXRjaCh0YWJsZXNVcmwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSkgPyAoYXdhaXQgci5qc29uKCkpLmVycm9yLm1lc3NhZ2UgOiBhd2FpdCByLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgIT0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFibGVzSnNvbiA9IGF3YWl0IHIuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhYmxlcyA9IHRhYmxlc0pzb24ubWFwKGl0ZW0gPT4gYCR7aXRlbS5zY2hlbWFOYW1lfS4ke2l0ZW0udGFibGVOYW1lfWApO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaCh0YWJsZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0YWJsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBUYWJsZXMuLi5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZy52YWwodGFibGVzLmpvaW4oKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB0YWJsZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhYmxlU2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJDYW4ndCBsb2FkIERhdGEgU291cmNlcy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvckRhdGFTb3VyY2VzXCIsIGUpLnNob3coKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlU2VsZWN0ZWQ/Lmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdGFibGVTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YWJsZVNlbGVjdGVkPy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIHRhYmxlVGFiID0gdGFibGVTZWxlY3RlZC5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgdmFyIHNjaGVtYU5hbWUgPSB0YWJsZVRhYlswXTtcclxuICAgICAgICB2YXIgdGFibGVOYW1lID0gdGFibGVUYWJbMV07XHJcblxyXG4gICAgICAgIC8vIGJlZm9yZSByZWZyZXNoaW5nIGNvbHVtbnMsIGFkZCBkYXRhIHRvIHByZXZpZXcgYnV0dG9uc1xyXG4gICAgICAgIGxldCAkcHJldmlld0VudGl0eUJ1dHRvbiA9ICQoXCIjcHJldmlld0VudGl0eUJ1dHRvblwiKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZW5naW5lLWlkXCIsIGVuZ2luZUlkKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZGF0YS1zb3VyY2UtbmFtZVwiLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJzY2hlbWEtbmFtZVwiLCBzY2hlbWFOYW1lKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwidGFibGUtbmFtZVwiLCB0YWJsZU5hbWUpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJ0aXRsZVwiLCBgVGFibGUgcHJldmlldyBbJHtzY2hlbWFOYW1lfV0uWyR7dGFibGVOYW1lfV1gKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuaW1wb3J0IHsgbW9kYWxQYW5lbEVycm9yIH0gZnJvbSBcIi4uL21vZGFsL2luZGV4XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNEZWxpbWl0ZWRUZXh0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmdpbmVJZFxyXG4gICAgICovXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50LCBlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PURlbGltaXRlZFRleHQmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIGFsbCBzZWxlY3QgcGlja2VyIGludG8gc2VsZWN0cGlja2VyXHJcbiAgICAgICAgJCgnc2VsZWN0Jykuc2VsZWN0cGlja2VyKCk7XHJcblxyXG5cclxuICAgICAgICAvLyBvbmNlIGxvYWRlZCwgZ2V0IHRoZSBzZWxlY3RvcnNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0l0ZW1zU3RyaW5nYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNKc29uU2VsZWN0U3RyaW5nID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZXNKc29uSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMgPSAkKFwiI2xhYmVsRXJyb3JEYXRhU291cmNlc1wiKTtcclxuICAgICAgICAvLyBvbiBkYXRhIHNvdXJjZXMgY2hhbmdlcywgcmVmcmVzaCB0aGUgdGFibGVzXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuY2hhbmdlKGFzeW5jICgpID0+IHsgYXdhaXQgdGhpcy5yZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCkgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RnVsbFBhdGhgKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGlyZWN0b3J5UGF0aCA9ICQoXCIjbGFiZWxFcnJvckRpcmVjdG9yeVBhdGhcIik7XHJcblxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlZnJlc2hEYXRhU291cmNlc0FzeW5jKGVuZ2luZUlkKSwgMTApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpIHtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBEYXRhIFNvdXJjZXMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy5lbXB0eSgpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5tYXBEYXRhU291cmNlcyA9IG5ldyBNYXAoKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCBmZXRjaChgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZUJsb2JTdG9yYWdlYCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlczEgPSBkYXRhU291cmNlc0pzb24ubWFwKGl0ZW0gPT4geyBsZXQgaSA9IHt9OyBpLm5hbWUgPSBpdGVtLm5hbWU7IGkuZGF0YVNvdXJjZVR5cGUgPSBpdGVtLmRhdGFTb3VyY2VUeXBlOyByZXR1cm4gaTsgfSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YVNvdXJjZXMxLCAoaSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbS5uYW1lLCB0ZXh0OiBpdGVtLm5hbWUgfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgciA9IGF3YWl0IGZldGNoKGAvZW50aXRpZXMvbmV3L2RhdGFzb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmRhdGFTb3VyY2VUeXBlPUF6dXJlQmxvYkZTYCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzMiA9IGRhdGFTb3VyY2VzSnNvbi5tYXAoaXRlbSA9PiB7IGxldCBpID0ge307IGkubmFtZSA9IGl0ZW0ubmFtZTsgaS5kYXRhU291cmNlVHlwZSA9IGl0ZW0uZGF0YVNvdXJjZVR5cGU7IHJldHVybiBpOyB9KTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlczIsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLm5hbWUsIHRleHQ6IGl0ZW0ubmFtZSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlczEuY29uY2F0KGRhdGFTb3VyY2VzMik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGFTb3VyY2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBEYXRhIFNvdXJjZXMuLi5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNKc29uU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbChkYXRhU291cmNlcy5tYXAoZHMgPT4gZHMubmFtZSkuam9pbigpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzSnNvblNlbGVjdFN0cmluZy52YWwoSlNPTi5zdHJpbmdpZnkoZGF0YVNvdXJjZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGF0YVNvdXJjZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YVNvdXJjZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCwgZGF0YVNvdXJjZVNlbGVjdGVkKTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yXCIsIGUpLnNob3coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmVuYWJsZVBpY2tlcigpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaFN0b3JhZ2VzUGF0aHMoZW5naW5lSWQpIHtcclxuXHJcbiAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuZGlzYWJsZVBpY2tlcihcIkxvYWRpbmcgYWxsIHBhdGhzIC4uLlwiKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGlyZWN0b3J5UGF0aC5lbXB0eSgpO1xyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzID0gSlNPTi5wYXJzZSh0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcudmFsKCkpO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2UgPSBkYXRhU291cmNlcy5maW5kKGUgPT4gZS5uYW1lID09IGRhdGFTb3VyY2VTZWxlY3RlZCk7XHJcblxyXG4gICAgICAgIGxldCBlbnRpdHlMb2NhdGlvblR5cGVFbGVtZW50ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9TG9jYXRpb25UeXBlYCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhU291cmNlLmRhdGFTb3VyY2VUeXBlID09PSAnQXp1cmVCbG9iU3RvcmFnZScpXHJcbiAgICAgICAgICAgIGVudGl0eUxvY2F0aW9uVHlwZUVsZW1lbnQudmFsKCdBenVyZUJsb2JTdG9yYWdlTG9jYXRpb24nKTtcclxuICAgICAgICBlbHNlIGlmIChkYXRhU291cmNlLmRhdGFTb3VyY2VUeXBlID09PSAnQXp1cmVCbG9iRlMnKVxyXG4gICAgICAgICAgICBlbnRpdHlMb2NhdGlvblR5cGVFbGVtZW50LnZhbCgnQXp1cmVCbG9iRlNMb2NhdGlvbicpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGxldCBkaXJlY3RvcmllcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGAvYXBpL3N0b3JhZ2VzLyR7ZW5naW5lSWR9LyR7ZGF0YVNvdXJjZS5uYW1lfS9maWxlc2ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSkgPyAoYXdhaXQgci5qc29uKCkpLmVycm9yLm1lc3NhZ2UgOiBhd2FpdCByLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZGlyZWN0b3JpZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yaWVzID0gZGlyZWN0b3JpZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGlyZWN0b3JpZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLnRleHQoXCJVbmV4cGVjdGVkIFNlcnZlciBlcnJvclwiKTtcclxuICAgICAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgU3RvcmFnZSBmaWxlcy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvclwiLCBlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmVuYWJsZVBpY2tlcigpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmltcG9ydCB7IG1vZGFsUGFuZWxFcnJvciB9IGZyb20gXCIuLi9tb2RhbC9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzUGFycXVldCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtKUXVlcnk8SFRNTEVsZW1lbnQ+fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5naW5lSWRcclxuICAgICAqL1xyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCwgZW5naW5lSWQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZW50aXRpZXMvbmV3L2VudGl0aWVzP2R2dD1QYXJxdWV0JmVuZ2luZUlkPSR7ZW5naW5lSWR9YCk7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBhbGwgc2VsZWN0IHBpY2tlciBpbnRvIHNlbGVjdHBpY2tlclxyXG4gICAgICAgICQoJ3NlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICAvLyBvbmNlIGxvYWRlZCwgZ2V0IHRoZSBzZWxlY3RvcnNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0l0ZW1zU3RyaW5nYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNKc29uU2VsZWN0U3RyaW5nID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZXNKc29uSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMgPSAkKFwiI2xhYmVsRXJyb3JEYXRhU291cmNlc1wiKTtcclxuICAgICAgICAvLyBvbiBkYXRhIHNvdXJjZXMgY2hhbmdlcywgcmVmcmVzaCB0aGUgdGFibGVzXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuY2hhbmdlKGFzeW5jICgpID0+IHsgYXdhaXQgdGhpcy5yZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCkgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RnVsbFBhdGhgKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGlyZWN0b3J5UGF0aCA9ICQoXCIjbGFiZWxFcnJvckRpcmVjdG9yeVBhdGhcIik7XHJcblxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlZnJlc2hEYXRhU291cmNlc0FzeW5jKGVuZ2luZUlkKSwgMTApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpIHtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBEYXRhIFNvdXJjZXMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy5lbXB0eSgpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5tYXBEYXRhU291cmNlcyA9IG5ldyBNYXAoKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCBmZXRjaChgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZUJsb2JTdG9yYWdlYCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlczEgPSBkYXRhU291cmNlc0pzb24ubWFwKGl0ZW0gPT4geyBsZXQgaSA9IHt9OyBpLm5hbWUgPSBpdGVtLm5hbWU7IGkuZGF0YVNvdXJjZVR5cGUgPSBpdGVtLmRhdGFTb3VyY2VUeXBlOyByZXR1cm4gaTsgfSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YVNvdXJjZXMxLCAoaSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbS5uYW1lLCB0ZXh0OiBpdGVtLm5hbWUgfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgciA9IGF3YWl0IGZldGNoKGAvZW50aXRpZXMvbmV3L2RhdGFzb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmRhdGFTb3VyY2VUeXBlPUF6dXJlQmxvYkZTYCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzMiA9IGRhdGFTb3VyY2VzSnNvbi5tYXAoaXRlbSA9PiB7IGxldCBpID0ge307IGkubmFtZSA9IGl0ZW0ubmFtZTsgaS5kYXRhU291cmNlVHlwZSA9IGl0ZW0uZGF0YVNvdXJjZVR5cGU7IHJldHVybiBpOyB9KTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlczIsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLm5hbWUsIHRleHQ6IGl0ZW0ubmFtZSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlczEuY29uY2F0KGRhdGFTb3VyY2VzMik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGFTb3VyY2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBEYXRhIFNvdXJjZXMuLi5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNKc29uU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbChkYXRhU291cmNlcy5tYXAoZHMgPT4gZHMubmFtZSkuam9pbigpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzSnNvblNlbGVjdFN0cmluZy52YWwoSlNPTi5zdHJpbmdpZnkoZGF0YVNvdXJjZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGF0YVNvdXJjZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YVNvdXJjZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCwgZGF0YVNvdXJjZVNlbGVjdGVkKTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yXCIsIGUpLnNob3coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmVuYWJsZVBpY2tlcigpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaFN0b3JhZ2VzUGF0aHMoZW5naW5lSWQpIHtcclxuXHJcbiAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuZGlzYWJsZVBpY2tlcihcIkxvYWRpbmcgYWxsIHBhdGhzIC4uLlwiKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGlyZWN0b3J5UGF0aC5lbXB0eSgpO1xyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzID0gSlNPTi5wYXJzZSh0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcudmFsKCkpO1xyXG5cclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2UgPSBkYXRhU291cmNlcy5maW5kKGUgPT4gZS5uYW1lID09IGRhdGFTb3VyY2VTZWxlY3RlZCk7XHJcblxyXG4gICAgICAgIGxldCBlbnRpdHlMb2NhdGlvblR5cGVFbGVtZW50ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9TG9jYXRpb25UeXBlYCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhU291cmNlLmRhdGFTb3VyY2VUeXBlID09PSAnQXp1cmVCbG9iU3RvcmFnZScpXHJcbiAgICAgICAgICAgIGVudGl0eUxvY2F0aW9uVHlwZUVsZW1lbnQudmFsKCdBenVyZUJsb2JTdG9yYWdlTG9jYXRpb24nKTtcclxuICAgICAgICBlbHNlIGlmIChkYXRhU291cmNlLmRhdGFTb3VyY2VUeXBlID09PSAnQXp1cmVCbG9iRlMnKVxyXG4gICAgICAgICAgICBlbnRpdHlMb2NhdGlvblR5cGVFbGVtZW50LnZhbCgnQXp1cmVCbG9iRlNMb2NhdGlvbicpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGxldCBkaXJlY3RvcmllcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGAvYXBpL3N0b3JhZ2VzLyR7ZW5naW5lSWR9LyR7ZGF0YVNvdXJjZS5uYW1lfS9maWxlc2ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSkgPyAoYXdhaXQgci5qc29uKCkpLmVycm9yLm1lc3NhZ2UgOiBhd2FpdCByLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZGlyZWN0b3JpZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yaWVzID0gZGlyZWN0b3JpZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGlyZWN0b3JpZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLnRleHQoXCJVbmV4cGVjdGVkIFNlcnZlciBlcnJvclwiKTtcclxuICAgICAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgU3RvcmFnZSBmaWxlcy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvclwiLCBlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmVuYWJsZVBpY2tlcigpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbEVycm9yLCBtb2RhbFBhbmVsUHJldmlldyB9IGZyb20gXCIuLi9tb2RhbC9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBlbnRpdGllc0F6dXJlU3FsIH0gZnJvbSBcIi4vZW50aXRpZXNBenVyZVNxbC5qc1wiO1xyXG5pbXBvcnQgeyBlbnRpdGllc0RlbGltaXRlZFRleHQgfSBmcm9tIFwiLi9lbnRpdGllc0RlbGltaXRlZFRleHQuanNcIjtcclxuaW1wb3J0IHsgZW50aXRpZXNQYXJxdWV0IH0gZnJvbSBcIi4vZW50aXRpZXNQYXJxdWV0LmpzXCI7XHJcbmltcG9ydCB7IHdpemFyZFBhZ2UgfSBmcm9tICcuLi93aXphcmQvaW5kZXguanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzTmV3UGFnZSBleHRlbmRzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCdFbnRpdHlWaWV3JywgJy9lbnRpdGllcy9uZXcvZW5naW5lcycpO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzQXp1cmVTcWwgPSBuZXcgZW50aXRpZXNBenVyZVNxbCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXNEZWxpbWl0ZWRUZXh0ID0gbmV3IGVudGl0aWVzRGVsaW1pdGVkVGV4dCgpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXNQYXJxdWV0ID0gbmV3IGVudGl0aWVzUGFycXVldCgpO1xyXG4gICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvLyBjYWxsIGJhc2Ugb25Mb2FkIG1ldGhvZFxyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG5cclxuICAgICAgICAvLyBpbml0IHByZXZpZXcgcGFuZWxcclxuICAgICAgICBtb2RhbFBhbmVsUHJldmlldy5pbml0aWFsaXplKFwicGFuZWxQcmV2aWV3XCIpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gYWxsIHNlbGVjdCBwaWNrZXIgaW50byBzZWxlY3RwaWNrZXJcclxuICAgICAgICAkKCdzZWxlY3QnKS5zZWxlY3RwaWNrZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQub24oXCJsZWF2ZVN0ZXBcIiwgKGUsIGFuY2hvck9iamVjdCwgY3VycmVudFN0ZXBJbmRleCwgbmV4dFN0ZXBJbmRleCwgc3RlcERpcmVjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGVwSW5kZXggPT0gMSAmJiBuZXh0U3RlcEluZGV4ID09IDIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoYGlucHV0W25hbWU9XCJFbnRpdHlWaWV3LkVudGl0eVR5cGVcIl06Y2hlY2tlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSAhPT0gJ0F6dXJlU3FsVGFibGUnICYmIHR5cGUgIT09ICdEZWxpbWl0ZWRUZXh0JyAmJiB0eXBlICE9PSAnUGFycXVldCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKCdlbnRpdHlTdGVwTm90RXhpc3QnLCAndGhpcyBlbnRpdHkgaXMgbm90IHlldCBpbXBsZW1lbnRlZC4uLicpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAxKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInN0ZXBDb250ZW50XCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09IDIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9IHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbmdpbmVJZD8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoYGlucHV0W25hbWU9XCJFbnRpdHlWaWV3LkVudGl0eVR5cGVcIl06Y2hlY2tlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0VHlwZVNlbGVjdGVkID09PSB0eXBlLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSB0eXBlLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSAnQXp1cmVTcWxUYWJsZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVudGl0aWVzQXp1cmVTcWwubG9hZEFzeW5jKHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzLCBlbmdpbmVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdEZWxpbWl0ZWRUZXh0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmxvYWRBc3luYyh0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcywgZW5naW5lSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnUGFycXVldCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVudGl0aWVzUGFycXVldC5sb2FkQXN5bmModGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMsIGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlIH0gZnJvbSBcIi4uL2Jvb3RzdHJhcFRhYmxlcy9pbmRleC5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzRGV0YWlsc1BhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblBvc3RCb2R5KGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmUgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICB0aGlzLiRlbmdpbmVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2NoZWNrJywgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uQ2xpY2tSb3cocm93KSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSByb3c7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkRW50aXRpZXNBc3luYyh0aGlzLmVuZ2luZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRhYmxlXHJcbiAgICAgICAgdGhpcy4kcGlwZWxpbmVzVGFibGUgPSAkKFwiI3BpcGVsaW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuJHBpcGVsaW5lc1RhYmxlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuJHBpcGVsaW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCk7XHJcbiAgICB9XHJcblxyXG4gXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBlbnRpdGllc05ld1ZlcnNpb25QYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgJChcImlucHV0W3R5cGU9J251bWJlciddXCIpLmlucHV0U3Bpbm5lcigpO1xyXG5cclxuICAgICAgICAvLyBnZXQgd2l6YXJkXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQgPSAkKFwiI3NtYXJ0V2l6YXJkXCIpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYm9vdHN0cmFwIHdpemFyZFxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IDAsXHJcbiAgICAgICAgICAgIHRoZW1lOiAnZGVmYXVsdCcsIC8vIHRoZW1lIGZvciB0aGUgd2l6YXJkLCByZWxhdGVkIGNzcyBuZWVkIHRvIGluY2x1ZGUgZm9yIG90aGVyIHRoYW4gZGVmYXVsdCB0aGVtZVxyXG4gICAgICAgICAgICBhdXRvQWRqdXN0SGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAganVzdGlmaWVkOiBmYWxzZSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAnZmFkZScsIC8vIEVmZmVjdCBvbiBuYXZpZ2F0aW9uLCBub25lL2ZhZGUvc2xpZGUtaG9yaXpvbnRhbC9zbGlkZS12ZXJ0aWNhbC9zbGlkZS1zd2luZ1xyXG4gICAgICAgICAgICAgICAgc3BlZWQ6ICcyMDAnLCAvLyBUcmFuc2lvbiBhbmltYXRpb24gc3BlZWRcclxuICAgICAgICAgICAgICAgIGVhc2luZzogJycgLy8gVHJhbnNpdGlvbiBhbmltYXRpb24gZWFzaW5nLiBOb3Qgc3VwcG9ydGVkIHdpdGhvdXQgYSBqUXVlcnkgZWFzaW5nIHBsdWdpblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbmFibGVVUkxoYXNoOiBmYWxzZSxcclxuICAgICAgICAgICAgdG9vbGJhclNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICB0b29sYmFyUG9zaXRpb246ICdub25lJywgLy8gbm9uZSwgdG9wLCBib3R0b20sIGJvdGhcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJCdXR0b25Qb3NpdGlvbjogJ3JpZ2h0JywgLy8gbGVmdCwgcmlnaHQsIGNlbnRlclxyXG4gICAgICAgICAgICAgICAgc2hvd05leHRCdXR0b246IGZhbHNlLCAvLyBzaG93L2hpZGUgYSBOZXh0IGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgc2hvd1ByZXZpb3VzQnV0dG9uOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGEgUHJldmlvdXMgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyRXh0cmFCdXR0b25zOiBbXSAvLyBFeHRyYSBidXR0b25zIHRvIHNob3cgb24gdG9vbGJhciwgYXJyYXkgb2YgalF1ZXJ5IGlucHV0L2J1dHRvbnMgZWxlbWVudHNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5jaG9yU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGFuY2hvckNsaWNrYWJsZTogdHJ1ZSwgLy8gRW5hYmxlL0Rpc2FibGUgYW5jaG9yIG5hdmlnYXRpb25cclxuICAgICAgICAgICAgICAgIGVuYWJsZUFsbEFuY2hvcnM6IHRydWUsIC8vIEFjdGl2YXRlcyBhbGwgYW5jaG9ycyBjbGlja2FibGUgYWxsIHRpbWVzXHJcbiAgICAgICAgICAgICAgICBtYXJrRG9uZVN0ZXA6IHRydWUsIC8vIEFkZCBkb25lIHN0YXRlIG9uIG5hdmlnYXRpb25cclxuICAgICAgICAgICAgICAgIG1hcmtBbGxQcmV2aW91c1N0ZXBzQXNEb25lOiB0cnVlLCAvLyBXaGVuIGEgc3RlcCBzZWxlY3RlZCBieSB1cmwgaGFzaCwgYWxsIHByZXZpb3VzIHN0ZXBzIGFyZSBtYXJrZWQgZG9uZVxyXG4gICAgICAgICAgICAgICAgcmVtb3ZlRG9uZVN0ZXBPbk5hdmlnYXRlQmFjazogZmFsc2UsIC8vIFdoaWxlIG5hdmlnYXRlIGJhY2sgZG9uZSBzdGVwIGFmdGVyIGFjdGl2ZSBzdGVwIHdpbGwgYmUgY2xlYXJlZFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlQW5jaG9yT25Eb25lU3RlcDogdHJ1ZSAvLyBFbmFibGUvRGlzYWJsZSB0aGUgZG9uZSBzdGVwcyBuYXZpZ2F0aW9uXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGtleWJvYXJkU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGtleU5hdmlnYXRpb246IGZhbHNlLCAvLyBFbmFibGUvRGlzYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uKGxlZnQgYW5kIHJpZ2h0IGtleXMgYXJlIHVzZWQgaWYgZW5hYmxlZClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5sZXQganF1ZXJ5RXh0ZW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBleHRlbmQgcGlja2VyXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgZGlzYWJsZVBpY2tlcjogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICB0aGlzLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0cihcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBtc2cpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBlbmFibGVQaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIGV4dGVuZCBlbmFibGUgZGlzYWJsZSBvZiBidXR0b25zIGFuZCBhIGhyZWZcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBlbmFibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgLy8gZXh0ZW5kIGxvYWQgYXN5bmNcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBsb2FkQXN5bmM6IGZ1bmN0aW9uIChkYXRhX3VybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKGRhdGFfdXJsLCAocmVzcG9uc2UsIHN0YXR1cywgeGhyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBcImVycm9yXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIHRlc3RBc3luYzogYXN5bmMgZnVuY3Rpb24gKHVybCkge1xyXG5cclxuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgYnV0dG9uIHdoaWNoIGNsaWNrZWQgIVxyXG4gICAgICAgICAgICBsZXQgJGJ0biA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkLWZsZXggYWxpZ24taXRlbXMtYmFzZWxpbmUgdGV4dC1ub3dyYXAnKS5hZGRDbGFzcygnZC1mbGV4IGFsaWduLWl0ZW1zLWJhc2VsaW5lIHRleHQtbm93cmFwJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnRuSWQgPSAkYnRuLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgICAgIGxldCBzcGlubmVySWQgPSBgJHtidG5JZH1TcGlubmVyYDtcclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2VJZCA9IGAke2J0bklkfU1lc3NhZ2VgO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRzcGlubmVyU3BhbiA9ICQoYCMke3NwaW5uZXJJZH1gKTtcclxuICAgICAgICAgICAgbGV0ICRtZXNzYWdlU3BhbiA9ICQoYCMke21lc3NhZ2VJZH1gKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJHNwaW5uZXJTcGFuLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICRidG4uYWZ0ZXIoYDxzcGFuIGlkPSR7c3Bpbm5lcklkfSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIiBjbGFzcz1cIm1sLTJcIj48aSBjbGFzcz1cImZhcyBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+PC9zcGFuPmApO1xyXG5cclxuICAgICAgICAgICAgJHNwaW5uZXJTcGFuID0gJChgIyR7c3Bpbm5lcklkfWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkbWVzc2FnZVNwYW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgJHNwaW5uZXJTcGFuLmFmdGVyKGA8c3BhbiBpZD0ke21lc3NhZ2VJZH0gc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCIgY2xhc3M9XCJtbC0yXCI+PC9zcGFuPmApO1xyXG5cclxuICAgICAgICAgICAgJG1lc3NhZ2VTcGFuID0gJChgIyR7bWVzc2FnZUlkfWApO1xyXG5cclxuICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmhpZGUoKTtcclxuICAgICAgICAgICAgJHNwaW5uZXJTcGFuLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCAkYnRuLnBvc3RBc3luYyh1cmwsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lclNwYW4uaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyLmVycm9ycyB8fCByID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyICYmIHIuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IE9iamVjdC52YWx1ZXMoci5lcnJvcnMpLmZsYXRNYXAoZSA9PiBlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBbXCJDYW4ndCBjb25uZWN0XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBgPGkgY2xhc3M9XCJmYXMgZmEtZXhjbGFtYXRpb25cIj48L2k+ICR7ZXJyb3JzWzBdfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmFkZENsYXNzKFwidGV4dC1kYW5nZXJcIikucmVtb3ZlQ2xhc3MoXCJ0ZXh0LXN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBodG1sID0gJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPiBjb25uZWN0aW9uIHN1Y2Nlc3NmdWwnO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZXNzYWdlU3Bhbi5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZXNzYWdlU3Bhbi5hZGRDbGFzcyhcInRleHQtc3VjY2Vzc1wiKS5yZW1vdmVDbGFzcyhcInRleHQtZGFuZ2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLnNob3coKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yRXh0ZW5zaW9uUG9zdFwiLCBlKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgcG9zdEFzeW5jOiBhc3luYyBmdW5jdGlvbiAodXJsLCBjaGVja0lzVmFsaWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghJChcImZvcm1cIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hlY2tJc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMYXVuY2ggYSB2YWxpZGF0aW9uIGJlZm9yZVxyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSAkKFwiZm9ybVwiKS52YWxpZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBmb3JtVmFsdWVzID0gJCgnZm9ybScpLnNlcmlhbGl6ZUFycmF5KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybWRhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgJC5lYWNoKGZvcm1WYWx1ZXMsIGZ1bmN0aW9uIChpLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JtZGF0YS5hcHBlbmQodi5uYW1lLCB2LnZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwIHx8IHJlc3BvbnNlSnNvbiA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrSXNWYWxpZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoZG9jdW1lbnQpLmZpbmQoXCJbZGF0YS12YWxtc2ctc3VtbWFyeT10cnVlXVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBjb250YWluZXIuZmluZChcInVsXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlSnNvbiAmJiByZXNwb25zZUpzb24uZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBPYmplY3QudmFsdWVzKHJlc3BvbnNlSnNvbi5lcnJvcnMpLmZsYXRNYXAoZSA9PiBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IFtcIkNhbid0IGNvbm5lY3RcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ICYmIGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktZXJyb3JzXCIpLnJlbW92ZUNsYXNzKFwidmFsaWRhdGlvbi1zdW1tYXJ5LXZhbGlkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChlcnJvcnMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiPGxpIC8+XCIpLmh0bWwodGhpcykuYXBwZW5kVG8obGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VKc29uO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFeGNlcHRpb246IFtlXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcblxyXG4vL2FzeW5jIHBvc3RBc3luYygpIHtcclxuLy8gICAgLy8gRmlyc3QsIHNhdmUgdGhlIGRlcGxveW1lbnQuXHJcblxyXG4vLyAgICBsZXQgdG9rZW4gPSAkKCdpbnB1dFtuYW1lPVwiX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW5cIl0nKS52YWwoKTtcclxuXHJcbi8vICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcnLCB7XHJcbi8vICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuLy8gICAgICAgIGJvZHk6IGBkYXRhU291cmNlVmlldy5FbmdpbmVJZD0ke3RoaXMuZGF0YVNvdXJjZVZpZXcuZW5naW5lSWR9YCArXHJcbi8vICAgICAgICAgICAgYCZkYXRhU291cmNlVmlldy5EYXRhU291cmNlVHlwZT0ke3RoaXMuZGF0YVNvdXJjZVZpZXcuZGF0YVNvdXJjZVR5cGV9YCArXHJcbi8vICAgICAgICAgICAgYCZkYXRhU291cmNlVmlldy5Db25uZWN0aW9uU3RyaW5nPSR7dGhpcy5kYXRhU291cmNlVmlldy5jb25uZWN0aW9uU3RyaW5nfWAgK1xyXG4vLyAgICAgICAgICAgIGAmX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW49JHt0b2tlbn1gLFxyXG4vLyAgICAgICAgaGVhZGVyczoge1xyXG4vLyAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PXV0Zi04XCJcclxuLy8gICAgICAgIH1cclxuLy8gICAgfSk7XHJcblxyXG4vL31cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChqcXVlcnlFeHRlbmRzKSgpOyIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgcm91dGVyIGZyb20gXCIuL3JvdXRlci5qc1wiO1xyXG5pbXBvcnQgeyBkYXNoYm9hcmRQYWdlIH0gZnJvbSBcIi4vZGFzaGJvYXJkL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7IGVuZ2luZXNQYWdlLCBlbmdpbmVEZXRhaWxzUGFnZSB9IGZyb20gXCIuL2VuZ2luZXMvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgYWRtaW5QYWdlLCBhZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlLCBhZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZSB9IGZyb20gXCIuL2FkbWluL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7IG1ndGxvYWRlciB9IGZyb20gXCIuL21ndC5qc1wiO1xyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi9ub3RpZmljYXRpb24uanNcIjtcclxuaW1wb3J0IHsgaG9tZVBhZ2UgfSBmcm9tIFwiLi9ob21lL2hvbWVQYWdlLmpzXCI7XHJcbmltcG9ydCB7IHNldHRpbmdzUGFnZSB9IGZyb20gXCIuL3NldHRpbmdzL3NldHRpbmdzUGFnZS5qc1wiO1xyXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4vYXV0aC5qc1wiXHJcbmltcG9ydCB7IGRvdG1pbXRhYmxlIH0gZnJvbSBcIi4vZG90bWltdGFibGVcIlxyXG5pbXBvcnQgeyBwZXJzb25Gb3JtYXR0ZXJzIH0gZnJvbSAnLi9mb3JtYXR0ZXJzL2luZGV4LmpzJ1xyXG5pbXBvcnQgeyBkYXRhU291cmNlTmV3LCBkYXRhU291cmNlc1BhZ2UsIGRhdGFTb3VyY2VFZGl0IH0gZnJvbSAnLi9kYXRhU291cmNlcy9pbmRleC5qcydcclxuaW1wb3J0IHsgZW50aXRpZXNQYWdlLCBlbnRpdGllc05ld1BhZ2UsIGVudGl0aWVzRGV0YWlsc1BhZ2UsIGVudGl0aWVzTmV3VmVyc2lvblBhZ2UgfSBmcm9tICcuL2VudGl0aWVzL2luZGV4LmpzJ1xyXG5pbXBvcnQgZCBmcm9tICcuL2V4dGVuc2lvbnMuanMnO1xyXG5cclxuZG90bWltdGFibGUuaW5pdGlhbGl6ZSgpO1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBob21lIHBhZ2UgdG8gcmVnaXN0ZXIgbm90aWZpY2F0aW9uc1xyXG5ob21lUGFnZS5jdXJyZW50LmluaXRpYWxpemUoKTtcclxuXHJcbi8vIEluaXRpYWxpemUgYXV0aCBoZWxwZXJcclxuYXV0aC5jdXJyZW50LmluaXRpYWxpemUoKTtcclxuXHJcblxyXG5tZ3Rsb2FkZXIuc2V0TWd0UHJvdmlkZXIoKTtcclxubWd0bG9hZGVyLmludGVyY2VwdE1ndExvZ2luKCk7XHJcblxyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXNoYm9hcmQnLCBkYXNoYm9hcmRQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRGFzaGJvYXJkL0luZGV4JywgZGFzaGJvYXJkUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VuZ2luZXMnLCBlbmdpbmVzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VuZ2luZXMvSW5kZXgnLCBlbmdpbmVzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VuZ2luZXMvRGV0YWlscycsIGVuZ2luZURldGFpbHNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvQWRtaW4vSW5kZXgnLCBhZG1pblBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbicsIGFkbWluUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL1NldHRpbmdzL0luZGV4Jywgc2V0dGluZ3NQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvU2V0dGluZ3MnLCBzZXR0aW5nc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbi9EZXRhaWxzJywgYWRtaW5FbmdpbmVSZXF1ZXN0RGV0YWlsc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbi9EZXBsb3knLCBhZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRGF0YVNvdXJjZXMnLCBkYXRhU291cmNlc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcy9OZXcnLCBkYXRhU291cmNlTmV3KTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRGF0YVNvdXJjZXMvRWRpdCcsIGRhdGFTb3VyY2VFZGl0KTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW50aXRpZXMnLCBlbnRpdGllc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbnRpdGllcy9OZXcnLCBlbnRpdGllc05ld1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbnRpdGllcy9EZXRhaWxzJywgZW50aXRpZXNEZXRhaWxzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VudGl0aWVzL1ZlcnNpb24nLCBlbnRpdGllc05ld1ZlcnNpb25QYWdlKTtcclxuIl0sIm5hbWVzIjpbIm1vZGFsUGFuZWxFcnJvciIsInJvdXRlciJdLCJtYXBwaW5ncyI6IkFBQUM7QUFDRDtBQUNPLE1BQU0sTUFBTSxDQUFDO0FBQ3BCO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoRDtBQUNBLFFBQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRjtBQUNBLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsUUFBUSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM3QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxjQUFjLEdBQUc7QUFDckIsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDaEMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxrQkFBa0IsR0FBRztBQUN6QixRQUFRLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDO0FBQzNDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUc7QUFDcEIsUUFBUSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxlQUFlLEdBQUc7QUFDdEIsUUFBUSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNmO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7QUFDcEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztBQUM3RCxZQUFZLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hELFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksaUJBQWlCLENBQUMsYUFBYSxFQUFFO0FBQ3JDLFFBQVEsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQztBQUMvQztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7QUFDekMsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRO0FBQ3pELFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN4QztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLGVBQWUsQ0FBQyxXQUFXLEVBQUU7QUFDakMsUUFBUSxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsUUFBUSxPQUFPLElBQUksT0FBTyxFQUFFLENBQUM7QUFDN0IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUMzQjtBQUNBLFFBQVEsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRO0FBQzVDLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTtBQUNwQyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM1QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRztBQUNYO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQztBQUNkLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDcEQ7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVk7QUFDN0IsWUFBWSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzlEO0FBQ0EsUUFBUSxJQUFJLFVBQVUsQ0FBQztBQUN2QjtBQUNBLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLO0FBQ25DLFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFlBQVksSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsWUFBWSxJQUFJLE9BQU87QUFDdkIsZ0JBQWdCLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDL0IsU0FBUyxFQUFDO0FBQ1Y7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVO0FBQ3ZCLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlO0FBQzVCLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pFO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDN0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFlBQVksQ0FBQyxDQUFDLE1BQU07QUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMxRSxhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtBQUN2QyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLE1BQU07QUFDL0MsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFFO0FBQzNDLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxlQUFlLElBQUksTUFBTSxFQUFFOztBQ3BLMUI7QUFFRDtBQUNBO0FBQ08sTUFBTSxhQUFhLENBQUM7QUFDM0I7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxNQUFNLEdBQUc7QUFDbkI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxPQUFPLENBQUMsU0FBUyxFQUFFO0FBQzdCLEtBQUs7QUFDTDtBQUNBLElBQUksUUFBUSxHQUFHO0FBQ2YsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQzFCQztBQUNEO0FBQ08sTUFBTSxXQUFXLENBQUM7QUFDekI7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZixLQUFLO0FBQ0w7O0FDaEJDO0FBQ0Q7QUFDTyxNQUFNLFVBQVUsQ0FBQztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRTtBQUNwQixRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztBQUNyQyxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztBQUNqQyxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQzFCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxRQUFRLEdBQUc7QUFDZjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDO0FBQ25ELFlBQVksT0FBTyxJQUFJLENBQUM7QUFDeEI7QUFDQSxRQUFRLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ3JELFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2QztBQUNBLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO0FBQ2xDLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEVBQUUsR0FBRztBQUNULFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7QUFDbEMsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUM1QixRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRywrQ0FBK0MsQ0FBQztBQUM5RSxRQUFRLE9BQU8sSUFBSSxDQUFDO0FBQ3BCLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxHQUFHO0FBQ2IsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLCtDQUErQyxDQUFDO0FBQ3ZFLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsRUFBQyxFQUFFO0FBQ25GO0FBQ0EsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLEVBQUU7QUFDL0U7QUFDQSxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFDLEVBQUU7QUFDckY7QUFDQTtBQUNBO0FBQ0EsSUFBSSxLQUFLLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3ZDO0FBQ0E7QUFDQSxJQUFJLFlBQVksR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRTtBQUMxRDtBQUNBO0FBQ0EsSUFBSSxZQUFZLEdBQUc7QUFDbkIsUUFBUSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzNDLEtBQUs7QUFDTDtBQUNBLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFO0FBQzNCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUU7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsSUFBSSxLQUFLLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDNUM7QUFDQTtBQUNBLElBQUksa0JBQWtCLEdBQUc7QUFDekI7QUFDQSxRQUFRLElBQUksS0FBSyxHQUFHLENBQUM7QUFDckIsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDakksb0NBQW9DLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNsRSx5Q0FBeUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3ZEO0FBQ0Esb0RBQW9ELEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDMUQ7QUFDQTtBQUNBLG1HQUFtRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDN0c7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUMzRjtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQzFGO0FBQ0Esc0NBQXNDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsQ0FBQyxDQUFDO0FBQ2hCO0FBQ0EsUUFBUSxPQUFPLEtBQUssQ0FBQztBQUNyQixLQUFLO0FBQ0w7QUFDQTs7QUNsSU8sTUFBTSxRQUFRLENBQUM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsR0FBRyxJQUFJLEVBQUU7QUFDdkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ2pDLFFBQVEsSUFBSSxDQUFDLHNCQUFzQixHQUFHLHFCQUFxQixDQUFDO0FBQzVEO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxzQkFBc0I7QUFDdkMsWUFBWSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDMUU7QUFDQTtBQUNBLFFBQVEsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUMxQztBQUNBLFFBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25DO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0Q7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLFNBQVMsR0FBRztBQUNoQjtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQzFCO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7QUFDMUQ7QUFDQSxZQUFZLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztBQUN4RCxZQUFZLElBQUksQ0FBQyxJQUFJO0FBQ3JCLGdCQUFnQixJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUM7QUFDcEU7QUFDQSxZQUFZLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDckQsU0FBUztBQUNUO0FBQ0EsUUFBUSxPQUFPLFFBQVEsQ0FBQztBQUN4QixLQUFLO0FBQ0w7QUFDQSxJQUFJLFlBQVksR0FBRztBQUNuQixRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCO0FBQ3hDLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM3QyxRQUFRLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxLQUFLLEdBQUc7QUFDWixRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxZQUFZLENBQUMsVUFBVSxFQUFFO0FBQzdCO0FBQ0E7QUFDQSxRQUFRLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVHO0FBQ0EsUUFBUSxJQUFJLEdBQUcsR0FBRyxvSEFBb0gsQ0FBQztBQUN2SSxRQUFRLEdBQUcsSUFBSSxVQUFVLENBQUM7QUFDMUIsUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDO0FBQy9CO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQyxRQUFRLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUM1QjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUU7QUFDeEI7QUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNsRCxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDbkQsUUFBUSxHQUFHLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0FBQzVELFFBQVEsR0FBRyxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztBQUN4QjtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsUUFBUSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDdEI7QUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNsRCxRQUFRLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0RSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDbkQsUUFBUSxHQUFHLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQzNELFFBQVEsR0FBRyxJQUFJLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztBQUN4QjtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkMsUUFBUSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDeEMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQ3pDLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDNUM7QUFDQTtBQUNBLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtBQUNyQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDbEQsUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkUsUUFBUSxHQUFHLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ25ELFFBQVEsR0FBRyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztBQUM1RCxRQUFRLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUM7QUFDeEI7QUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLFFBQVEsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzVCLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FDM0hDO0FBQ0Q7QUFDTyxTQUFTLEtBQUssQ0FBQyxFQUFFLEVBQUU7QUFDMUIsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQztBQUVEO0FBQ08sTUFBTSxRQUFRLENBQUM7QUFDdEI7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQixRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRTtBQUN6QixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRTtBQUM5QixRQUFRLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdkMsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUN2QyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFDLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRTtBQUM1QixRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDekIsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsVUFBVSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QztBQUNBO0FBQ0EsUUFBUSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xEO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDdkIsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxJQUFJLE1BQU0sRUFBRTtBQUNwQjtBQUNBO0FBQ0EsWUFBWSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZEO0FBQ0E7QUFDQSxZQUFZLElBQUksU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2xDLGdCQUFnQixRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QztBQUNBO0FBQ0EsZ0JBQWdCLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDM0Msb0JBQW9CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRCxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVMsTUFBTTtBQUNmLFlBQVksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzVDLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLFVBQVUsRUFBRTtBQUNsQztBQUNBLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3pCO0FBQ0E7QUFDQSxRQUFRLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDM0Q7QUFDQTtBQUNBLFFBQVEsSUFBSSxPQUFPLEVBQUU7QUFDckI7QUFDQSxZQUFZLElBQUk7QUFDaEIsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLElBQUksT0FBTyxFQUFFO0FBQ3ZDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUM7QUFDOUMsaUJBQWlCO0FBQ2pCLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN4QixnQkFBZ0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckcsYUFBYTtBQUNiO0FBQ0EsU0FBUyxNQUFNO0FBQ2YsWUFBWSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsZ0NBQWdDLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDM0YsU0FBUztBQUNULEtBQUs7QUFDTDs7QUN0R0M7QUFJRDtBQUNBO0FBQ0E7QUFDTyxNQUFNLFlBQVksQ0FBQztBQUMxQjtBQUNBO0FBQ0EsSUFBSSxPQUFPLFFBQVE7QUFDbkI7QUFDQTtBQUNBLElBQUksV0FBVyxPQUFPLEdBQUc7QUFDekIsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVE7QUFDbEMsWUFBWSxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7QUFDdkQ7QUFDQSxRQUFRLE9BQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQztBQUNyQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sU0FBUyxHQUFHLFdBQVc7QUFDbEMsSUFBSSxPQUFPLFNBQVMsR0FBRyxXQUFXO0FBQ2xDLElBQUksT0FBTyxXQUFXLEdBQUcsYUFBYTtBQUN0QyxJQUFJLE9BQU8sWUFBWSxHQUFHLGNBQWM7QUFDeEM7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDbEMsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUNqQztBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTtBQUM1RCxhQUFhLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3BELGFBQWEsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0FBQ3RDLGFBQWEsc0JBQXNCLEVBQUU7QUFDckMsYUFBYSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUNyRCxhQUFhLEtBQUssRUFBRSxDQUFDO0FBQ3JCO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN4RTtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxLQUFLO0FBQy9DLFlBQVksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDckMsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDNUQsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxLQUFLLEdBQUc7QUFDbEIsUUFBUSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDM0I7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVc7QUFDNUIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUNoQztBQUNBLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtBQUNyRDtBQUNBLFlBQVksVUFBVSxFQUFFLENBQUM7QUFDekI7QUFDQSxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNuQyxnQkFBZ0IsTUFBTTtBQUN0QixhQUFhO0FBQ2I7QUFDQSxZQUFZLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRTtBQUNsRixnQkFBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pFLGdCQUFnQixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDOUMsYUFBYTtBQUNiO0FBQ0EsWUFBWSxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QjtBQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ25DLGdCQUFnQixNQUFNO0FBQ3RCLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUU7QUFDbkQsWUFBWSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUNyQyxZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN6RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxJQUFJLEdBQUc7QUFDakI7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRTtBQUM5RSxZQUFZLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QyxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxRCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDakM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDeEIsUUFBUSxJQUFJLE1BQU0sSUFBSSxZQUFZLENBQUMsV0FBVztBQUM5QyxZQUFZLE1BQU0sSUFBSSxZQUFZLENBQUMsWUFBWTtBQUMvQyxZQUFZLE1BQU0sSUFBSSxZQUFZLENBQUMsU0FBUztBQUM1QyxZQUFZLE1BQU0sSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFO0FBQzlDO0FBQ0EsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0M7QUFDQSxTQUFTLE1BQU07QUFDZjtBQUNBLFlBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUN6QixRQUFRLElBQUksTUFBTSxJQUFJLFlBQVksQ0FBQyxXQUFXO0FBQzlDLFlBQVksTUFBTSxJQUFJLFlBQVksQ0FBQyxZQUFZO0FBQy9DLFlBQVksTUFBTSxJQUFJLFlBQVksQ0FBQyxTQUFTO0FBQzVDLFlBQVksTUFBTSxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7QUFDOUM7QUFDQSxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNoRDtBQUNBLFNBQVMsTUFBTTtBQUNmO0FBQ0EsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDakQsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLElBQUksaUJBQWlCLENBQUMsS0FBSyxFQUFFO0FBQzdCLFFBQVEsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNwQyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUNoSkM7QUFJRDtBQUNBO0FBQ08sTUFBTSxzQkFBc0IsQ0FBQztBQUNwQztBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixFQUFFO0FBQ3pDLFFBQVEsT0FBTyxJQUFJLHNCQUFzQixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDN0QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsaUJBQWlCLEVBQUU7QUFDbkM7QUFDQSxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUNuRDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzdFO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDaEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUc7QUFDWCxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDcEM7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBQyxFQUFFLENBQUMsQ0FBQztBQUN4RyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0MsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN0RTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3RSxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RjtBQUNBO0FBQ0EsUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2pGO0FBQ0EsUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVksTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7QUFDcEksUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFlBQVksTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7QUFDNUksUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFlBQVksTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7QUFDMUksUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVksTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7QUFDcEk7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDNUI7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUM7QUFDaEQ7QUFDQSxRQUFRLElBQUkscUJBQXFCLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxxQkFBcUIsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ2pELFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDckQsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxhQUFhLEdBQUcsTUFBTSxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQzVCLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDMUMsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQztBQUNBLFFBQVEsQ0FBQyxDQUFDLDZEQUE2RCxHQUFHLGFBQWEsQ0FBQyxVQUFVLEdBQUcsY0FBYyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzdKO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO0FBQ2pHLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtBQUNqQztBQUNBLFFBQVEsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzdCO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUM1QixZQUFZLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7QUFDM0YsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0M7QUFDQTtBQUNBLFFBQVEsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hHO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO0FBQ3RHO0FBQ0EsUUFBUSxJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ3BDLFFBQVEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUMzRCxRQUFRLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDckQsUUFBUSxJQUFJLFdBQVcsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMxRDtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDdEU7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ3BDLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyw0Q0FBNEMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUcsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxlQUFlLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEQ7QUFDQSxRQUFRLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBQztBQUN6RDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsUUFBUSxNQUFNLENBQUMsS0FBSztBQUM1QixZQUFZLEtBQUssT0FBTztBQUN4QixnQkFBZ0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9ELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxVQUFVO0FBQzNCLGdCQUFnQixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFNBQVM7QUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZO0FBQ1osZ0JBQWdCLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksS0FBSztBQUNqQixZQUFZLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDdkIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FDaExDO0FBR0Q7QUFDTyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7QUFDekMsUUFBUSxPQUFPLElBQUksdUJBQXVCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUM5RCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRTtBQUNuQztBQUNBLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0FBQ25EO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDN0U7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxLQUFLLEdBQUc7QUFDWixRQUFRLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNoQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksR0FBRztBQUNYLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDbkMsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDckIsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUNwQztBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuRCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2RSxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbEY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksTUFBTSxVQUFVLENBQUMsS0FBSyxFQUFFO0FBQzVCO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDO0FBQ3pEO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUM7QUFDaEQ7QUFDQSxRQUFRLElBQUksY0FBYyxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUU7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksY0FBYyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDMUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsRUFBQztBQUNoRSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUM7QUFDaEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEVBQUM7QUFDbEc7QUFDQSxRQUFRLElBQUksVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hGO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLFVBQVUsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ3RDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsa0NBQWtDLEVBQUM7QUFDeEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxhQUFhLEdBQUcsTUFBTSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2pEO0FBQ0EsUUFBUSxJQUFJLGNBQWMsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNqRyxZQUFZLE1BQU0sRUFBRSxNQUFNO0FBQzFCLFlBQVksSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzFELFlBQVksT0FBTyxFQUFFO0FBQ3JCLGdCQUFnQixjQUFjLEVBQUUsaUNBQWlDO0FBQ2pFLGFBQWE7QUFDYixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLGNBQWMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0NBQWdDLEVBQUM7QUFDdEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVCxRQUFRLElBQUksaUJBQWlCLEdBQUcsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDNUQ7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsb0NBQW9DLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUM7QUFDekk7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUM7QUFDeEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0scUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxRQUFRLE1BQU0sQ0FBQyxLQUFLO0FBQzVCLFlBQVksS0FBSyxPQUFPO0FBQ3hCLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFVBQVU7QUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssU0FBUztBQUMxQixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxLQUFLO0FBQ2pCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtBQUN2QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQixRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEMsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUNwS0M7QUFHRDtBQUNPLE1BQU0sb0JBQW9CLENBQUM7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QyxRQUFRLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzNELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLGlCQUFpQixFQUFFO0FBQ25DO0FBQ0EsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7QUFDbkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM3RTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLEtBQUssR0FBRztBQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2hDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxHQUFHO0FBQ1gsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9DLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25ELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM1RCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDdEU7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZFLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsRjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDNUI7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQUM7QUFDekQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBQztBQUNoRDtBQUNBLFFBQVEsSUFBSSxjQUFjLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxjQUFjLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUMxQyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDBCQUEwQixFQUFDO0FBQ2hFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pEO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDckIsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsRUFBQztBQUNoRSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBQztBQUNoRyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsOEJBQThCLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBQztBQUNoRyxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsaUNBQWlDLENBQUMsRUFBQztBQUNwRTtBQUNBLFFBQVEsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0U7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksZ0JBQWdCLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUM1QyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDhCQUE4QixFQUFDO0FBQ3BFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksUUFBUSxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDckQ7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDO0FBQ0EsUUFBUSxJQUFJLG9CQUFvQixHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3ZHLFlBQVksTUFBTSxFQUFFLE1BQU07QUFDMUIsWUFBWSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDckQsWUFBWSxPQUFPLEVBQUU7QUFDckIsZ0JBQWdCLGNBQWMsRUFBRSxpQ0FBaUM7QUFDakUsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDL0IsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksb0JBQW9CLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNoRCxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDBCQUEwQixFQUFDO0FBQ2hFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1QsUUFBUSxJQUFJLFlBQVksR0FBRyxNQUFNLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQzdEO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHlDQUF5QyxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQztBQUNySTtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyw0Q0FBNEMsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDO0FBQ3hKO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLHNDQUFzQyxDQUFDLEVBQUM7QUFDekU7QUFDQSxRQUFRLGdCQUFnQixHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQy9FO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDNUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyw4QkFBOEIsRUFBQztBQUNwRSxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxRQUFRLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqRDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQztBQUN4QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTTtBQUNuQixZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLFFBQVEsTUFBTSxDQUFDLEtBQUs7QUFDNUIsWUFBWSxLQUFLLE9BQU87QUFDeEIsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssVUFBVTtBQUMzQixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxTQUFTO0FBQzFCLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWTtBQUNaLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0QsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLEtBQUs7QUFDakIsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BCLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QyxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQzFMQztBQUdEO0FBQ08sTUFBTSxxQkFBcUIsQ0FBQztBQUNuQztBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixFQUFFO0FBQ3pDLFFBQVEsT0FBTyxJQUFJLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDNUQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsaUJBQWlCLEVBQUU7QUFDbkM7QUFDQSxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUNuRDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzdFO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDaEMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUc7QUFDWCxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDcEM7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0MsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN0RTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkUsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM1QjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBQztBQUN6RDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFDO0FBQ2hEO0FBQ0EsUUFBUSxJQUFJLGNBQWMsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFFO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxjQUFjO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLGNBQWMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUM7QUFDaEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNyQixZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDBCQUEwQixFQUFDO0FBQ2hFLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUFDO0FBQ2xHLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFDO0FBQzNGLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFDO0FBQ3BFO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQzVDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0NBQWdDLEVBQUM7QUFDdEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNyRDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUM7QUFDQSxRQUFRLElBQUksb0JBQW9CLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDdkcsWUFBWSxNQUFNLEVBQUUsTUFBTTtBQUMxQixZQUFZLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNyRCxZQUFZLE9BQU8sRUFBRTtBQUNyQixnQkFBZ0IsY0FBYyxFQUFFLGlDQUFpQztBQUNqRSxhQUFhO0FBQ2IsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYztBQUMvQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxvQkFBb0IsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ2hELFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0NBQWdDLEVBQUM7QUFDdEUsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVCxRQUFRLElBQUksWUFBWSxHQUFHLE1BQU0sb0JBQW9CLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0Q7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsb0NBQW9DLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDO0FBQy9IO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDO0FBQ3hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsUUFBUSxNQUFNLENBQUMsS0FBSztBQUM1QixZQUFZLEtBQUssT0FBTztBQUN4QixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxVQUFVO0FBQzNCLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFNBQVM7QUFDMUIsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZO0FBQ1osZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzRCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksS0FBSztBQUNqQixZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDdkIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FDdEtDO0FBRUQ7QUFDQTtBQUNPLE1BQU0saUJBQWlCLENBQUM7QUFDL0I7QUFDQTtBQUNBLElBQUksT0FBTyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7QUFDekMsUUFBUSxPQUFPLElBQUksaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4RCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRTtBQUNuQztBQUNBLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0FBQ25ELFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3ZGO0FBQ0EsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNELFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RCxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDakMsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUc7QUFDWCxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDcEM7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hELFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoRDtBQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QyxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BELFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDckQsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM1QjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQTtBQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUM7QUFDL0MsUUFBUSxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFDO0FBQzVELFFBQVEsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUM7QUFDbkQsUUFBUSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQztBQUNqRDtBQUNBLFFBQVEsSUFBSTtBQUNaO0FBQ0EsWUFBWSxJQUFJLG1CQUFtQixHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDbko7QUFDQSxZQUFZLElBQUksbUJBQW1CLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNuRCxnQkFBZ0IsSUFBSSxXQUFXLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuRTtBQUNBLGdCQUFnQixJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7QUFDeEM7QUFDQSxvQkFBb0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNyRCxvQkFBb0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNsRjtBQUNBLG9CQUFvQixJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUM7QUFDQSxvQkFBb0IsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3JDLG9CQUFvQixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN4Qyx3QkFBd0IsT0FBTyxDQUFDLElBQUksQ0FBQztBQUNyQyw0QkFBNEIsS0FBSyxFQUFFLENBQUM7QUFDcEMsNEJBQTRCLEtBQUssRUFBRSxDQUFDO0FBQ3BDLHlCQUF5QixDQUFDLENBQUM7QUFDM0IscUJBQXFCO0FBQ3JCO0FBQ0Esb0JBQW9CLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUM7QUFDL0Msd0JBQXdCLE9BQU8sRUFBRSxPQUFPO0FBQ3hDLHdCQUF3QixJQUFJLEVBQUUsV0FBVztBQUN6QyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUIsTUFBTTtBQUN2QixvQkFBb0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEUsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDcEIsWUFBWSxJQUFJLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUQ7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtBQUN2QixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQixRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekMsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUMzR0M7QUFFRDtBQUNBO0FBQ08sTUFBTSxlQUFlLENBQUM7QUFDN0I7QUFDQTtBQUNBLElBQUksT0FBTyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7QUFDekMsUUFBUSxPQUFPLElBQUksZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdEQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsaUJBQWlCLEVBQUU7QUFDbkM7QUFDQSxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUNuRDtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzVFO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUc7QUFDWCxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3JCLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7QUFDcEM7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlDLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QztBQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN2QyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xELFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM1QjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0MsUUFBUSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBQztBQUNqRDtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsSUFBSSxXQUFXLEtBQUssRUFBRSxFQUFFO0FBQ2hELFlBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1RCxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDakU7QUFDQSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN2QixnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQztBQUNBLFlBQVksSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDO0FBQ0EsWUFBWSxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sSUFBSSxFQUFFO0FBQ3ZDLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0EsWUFBWSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU07QUFDekMsZ0JBQWdCLCtEQUErRCxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyw4RUFBOEU7QUFDOUssYUFBYSxDQUFDO0FBQ2Q7QUFDQSxZQUFZLElBQUksSUFBSSxDQUFDLGNBQWM7QUFDbkMsZ0JBQWdCLE9BQU87QUFDdkIsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BCLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN2QyxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQ3pGQztBQUVEO0FBQ0E7QUFDTyxNQUFNQSxpQkFBZSxDQUFDO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLEVBQUU7QUFDakQ7QUFDQSxRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUNuRCxRQUFRLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0FBQ3pDLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3JGO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRCxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDL0IsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLEdBQUc7QUFDWCxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtBQUNyQixRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5QyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUM7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkMsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5QyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2RCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM1QjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN2QyxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQ3REQztBQVdEO0FBQ08sTUFBTSxpQkFBaUIsQ0FBQztBQUMvQjtBQUNBO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CLFFBQVEsZUFBZSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzVELFFBQVEsZUFBZSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQzdELFFBQVEsZUFBZSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsZUFBZSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzFEO0FBQ0EsUUFBUSxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUMvRCxRQUFRLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2pFLFFBQVEsb0JBQW9CLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDM0QsUUFBUSxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM3RDtBQUNBLFFBQVEsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0I7QUFDQSxRQUFRLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNsQyxZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7QUFDL0U7QUFDQSxZQUFZLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsWUFBWTtBQUN4RSxnQkFBZ0IsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3hHLGFBQWEsQ0FBQyxDQUFDO0FBQ2Y7QUFDQSxZQUFZLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDckYsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0scUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxRQUFRLE1BQU0sQ0FBQyxLQUFLO0FBQzVCLFlBQVksS0FBSyxPQUFPO0FBQ3hCLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFVBQVU7QUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssV0FBVztBQUM1QixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxLQUFLO0FBQ2pCLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsRjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUM1RVEsTUFBTSxXQUFXLENBQUM7QUFDMUI7QUFDQSxJQUFJLE9BQU8sVUFBVSxHQUFHO0FBQ3hCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN6QixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7QUFDeEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM3QyxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQztBQUMvQyxRQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUN2QyxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM3QztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hEO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDNUIsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLENBQUM7QUFDdEM7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLO0FBQ3BDLFlBQVksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2pDLFlBQVksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLO0FBQ3JDLFlBQVksR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2pDLFlBQVksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNoRCxZQUFZLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4QixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSztBQUNqQyxZQUFZLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNqQyxZQUFZLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDaEQsWUFBWSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEIsU0FBUyxDQUFDLENBQUM7QUFDWCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sSUFBSSxHQUFHO0FBQ2pCLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN4RjtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSztBQUNoRDtBQUNBLFlBQVksSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ25DLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLGFBQWE7QUFDYjtBQUNBLFlBQVksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNwQyxnQkFBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxQztBQUNBLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxZQUFZLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0FBQ3hDLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLEdBQUcsR0FBRztBQUNWLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QixRQUFRLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN6QjtBQUNBLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksSUFBSTtBQUN6QyxZQUFZLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN6QyxZQUFZLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4QixTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUs7QUFDM0I7QUFDQSxZQUFZLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDO0FBQ3pIO0FBQ0EsWUFBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDakQsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDLFlBQVksSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7QUFDeEMsU0FBUyxDQUFDLENBQUM7QUFDWCxLQUFLO0FBQ0w7QUFDQSxJQUFJLGtCQUFrQixDQUFDLElBQUksRUFBRTtBQUM3QixRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN2RCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BGLEtBQUs7QUFDTDtBQUNBLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtBQUNwQixRQUFRLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNoRSxRQUFRLElBQUksQ0FBQyxZQUFZO0FBQ3pCLFlBQVksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNoRSxRQUFRLElBQUksQ0FBQyxZQUFZO0FBQ3pCLFlBQVksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUM3QjtBQUNBLFFBQVEsSUFBSSxHQUFHLElBQUksSUFBSSxRQUFRLENBQUM7QUFDaEM7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFlBQVksR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDO0FBQ3RGLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxvQkFBb0IsR0FBRztBQUMzQjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUM7QUFDL0IsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4RDtBQUNBLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0Q7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVO0FBQ25FLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQ7QUFDQSxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZEO0FBQ0EsS0FBSztBQUNMOztBQ2xIQztBQUdEO0FBQ08sTUFBTSxTQUFTLENBQUM7QUFDdkI7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQixLQUFLO0FBQ0w7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLEtBQUs7QUFDTDtBQUNBOztBQ2pCQztBQUtEO0FBQ08sTUFBTSx5QkFBeUIsQ0FBQztBQUN2QztBQUNBO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0EsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDNUQsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDN0QsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDekQsUUFBUSxlQUFlLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDMUQ7QUFDQSxRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEMsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBQzNFLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekMsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDakQ7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUN4QyxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLGdEQUFnRCxFQUFDO0FBQ3pGLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNqRjtBQUNBLFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxZQUFZO0FBQ3BFLFlBQVksTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3BHLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNoRSxZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFDO0FBQ3hELFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMseUJBQXlCLEVBQUM7QUFDL0QsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEQsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxZQUFZLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDO0FBQ3ZJLFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxZQUFZLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO0FBQ3JJLFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxZQUFZLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0FBQy9IO0FBQ0E7QUFDQSxRQUFRLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMzQztBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUs7QUFDL0MsWUFBWSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDakM7QUFDQTtBQUNBLFlBQVksSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzVDO0FBQ0EsWUFBWSxJQUFJLENBQUMsT0FBTztBQUN4QixnQkFBZ0IsT0FBTztBQUN2QjtBQUNBLFlBQVksTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDeEMsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sY0FBYyxHQUFHO0FBQzNCLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM5QjtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsRUFBQztBQUMzRDtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO0FBQ3hDLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0RBQWdELEVBQUM7QUFDekYsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUNwRTtBQUNBLFFBQVEsSUFBSTtBQUNaO0FBQ0EsWUFBWSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQ3BEO0FBQ0EsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3BCLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7QUFDdkUsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkQsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSTtBQUNaLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsbURBQW1ELENBQUMsQ0FBQztBQUMxRjtBQUNBO0FBQ0EsWUFBWSxJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdEO0FBQ0EsWUFBWSxJQUFJLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNoRTtBQUNBLFlBQVksSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUN4QyxnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUN2RyxnQkFBZ0IsSUFBSSxTQUFTLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxHQUFFO0FBQ3JELGdCQUFnQixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzVELGdCQUFnQixPQUFPO0FBQ3ZCLGFBQWE7QUFDYjtBQUNBLFlBQVksSUFBSSxlQUFlLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEQ7QUFDQSxZQUFZLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBQztBQUM3RDtBQUNBLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0scUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxRQUFRLE1BQU0sQ0FBQyxLQUFLO0FBQzVCLFlBQVksS0FBSyxPQUFPO0FBQ3hCLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFVBQVU7QUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssV0FBVztBQUM1QixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxLQUFLO0FBQ2pCLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLFFBQVEsR0FBRztBQUNyQixRQUFRLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEYsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUM1SUM7QUFXRDtBQUNPLE1BQU0sNkJBQTZCLENBQUM7QUFDM0M7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQixRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM1RCxRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUM3RCxRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN6RCxRQUFRLGVBQWUsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMxRDtBQUNBLFFBQVEsc0JBQXNCLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDL0QsUUFBUSx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNqRSxRQUFRLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzNELFFBQVEscUJBQXFCLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0Q7QUFDQSxRQUFRLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCO0FBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDbEMsWUFBWSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBQy9FO0FBQ0EsWUFBWSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDeEUsZ0JBQWdCLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4RyxhQUFhLENBQUMsQ0FBQztBQUNmO0FBQ0EsWUFBWSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0scUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMvQztBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU07QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxRQUFRLE1BQU0sQ0FBQyxLQUFLO0FBQzVCLFlBQVksS0FBSyxPQUFPO0FBQ3hCLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUQsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFVBQVU7QUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssV0FBVztBQUM1QixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELGdCQUFnQixNQUFNO0FBQ3RCLFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxLQUFLO0FBQ2pCLFlBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLFFBQVEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNsRjtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQ3RFTyxNQUFNLFNBQVMsQ0FBQztBQUN2QjtBQUNBO0FBQ0EsSUFBSSxPQUFPLGNBQWMsR0FBRztBQUM1QixRQUFRLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3RCxRQUFRLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyw4QkFBOEIsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztBQUM1RyxRQUFRLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUMxRTtBQUNBLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO0FBQ2hELEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxpQkFBaUIsR0FBRztBQUMvQixRQUFRLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FDbkNDO0FBRUQ7QUFDTyxNQUFNLElBQUksQ0FBQztBQUNsQjtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8sUUFBUTtBQUNoQjtBQUNBO0FBQ0EsQ0FBQyxXQUFXLE9BQU8sR0FBRztBQUN0QixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtBQUNwQixHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUM5QjtBQUNBLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3ZCLEVBQUU7QUFDRjtBQUNBLENBQUMsT0FBTyxlQUFlLEdBQUcsaUJBQWlCO0FBQzNDO0FBQ0EsQ0FBQyxXQUFXLEdBQUc7QUFDZixFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUNqQztBQUNBO0FBQ0EsRUFBRSxJQUFJLENBQUMsZUFBZSxHQUFHLHVCQUF1QixDQUFDO0FBQ2pELEVBQUU7QUFDRjtBQUNBLENBQUMsVUFBVSxHQUFHO0FBQ2Q7QUFDQSxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQ1Y7QUFDQSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLEVBQUM7QUFDM0UsR0FBRyxDQUFDLENBQUM7QUFDTCxFQUFFO0FBQ0Y7QUFDQSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFO0FBQzNCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLEVBQUU7QUFDRjtBQUNBLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUU7QUFDekIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEMsRUFBRTtBQUNGO0FBQ0E7O0FDMUNDO0FBSUQ7QUFDTyxNQUFNLFFBQVEsQ0FBQztBQUN0QjtBQUNBO0FBQ0EsSUFBSSxPQUFPLFFBQVE7QUFDbkI7QUFDQTtBQUNBLElBQUksV0FBVyxPQUFPLEdBQUc7QUFDekIsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVE7QUFDOUIsWUFBWSxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDL0M7QUFDQSxRQUFRLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUNqQyxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksVUFBVSxHQUFHO0FBQ2pCLFFBQVEsQ0FBQyxDQUFDLFlBQVksTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMzQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbEU7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0Q7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUQ7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDeEU7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxZQUFZO0FBQ3JFLFlBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3pELFlBQVksTUFBTSxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztBQUNuRCxTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsUUFBUSxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3JDO0FBQ0E7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUU7QUFDMUMsWUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ2Y7QUFDQSxZQUFZLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3JEO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sTUFBTSxJQUFJO0FBQzlELFlBQVksSUFBSSxNQUFNO0FBQ3RCLGdCQUFnQixNQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQ3ZELFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0seUJBQXlCLEdBQUc7QUFDdEM7QUFDQTtBQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsb0JBQW9CLENBQUM7QUFDdkMsUUFBUSxJQUFJLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUM5RDtBQUNBLFFBQVEsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3RDO0FBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTztBQUNwQixZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkM7QUFDQSxRQUFRLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDL0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLHlCQUF5QixHQUFHO0FBQ3RDO0FBQ0E7QUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLG9CQUFvQixDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEM7QUFDQSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDcEMsWUFBWSxPQUFPO0FBQ25CLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuRDtBQUNBLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN2QztBQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDbkQ7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUNuRTtBQUNBLFlBQVksV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CO0FBQ0E7QUFDQSxZQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsQ0FBQyxDQUFDLENBQUM7QUFDN0I7QUFDQSxTQUFTLE1BQU07QUFDZjtBQUNBLFlBQVksV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLFlBQVksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ25FO0FBQ0EsWUFBWSxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDbEQ7QUFDQSxnQkFBZ0IsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xDLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxHQUFHO0FBQzdCLG9CQUFvQixRQUFRLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO0FBQzFIO0FBQ0EsZ0JBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0M7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUNoRDtBQUNBO0FBQ0Esa0NBQWtDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUNsRCw0QkFBNEIsRUFBRSxRQUFRLENBQUM7QUFDdkM7QUFDQSw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7QUFDL0IsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM1QixRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDLFFBQVEsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLGtCQUFrQixDQUFDLEtBQUssRUFBRTtBQUM5QjtBQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0M7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyRCxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksbUJBQW1CLENBQUMsS0FBSyxFQUFFO0FBQy9CLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDckI7QUFDQSxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlDLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEQsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDbEU7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtBQUMzQyxZQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7QUFDL0IsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSztBQUM1RCxZQUFZLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNqQyxZQUFZLE1BQU0sSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDbkQsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7QUFDdkIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUM3T0M7QUFDRDtBQUNPLE1BQU0sWUFBWSxDQUFDO0FBQzFCO0FBQ0E7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQjtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxNQUFNLEdBQUc7QUFDbkIsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUNsQlEsU0FBUyx1QkFBdUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFO0FBQzlGO0FBQ0E7QUFDQSxJQUFJLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRyxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUM7QUFDbkQsSUFBSSxJQUFJLE9BQU8sR0FBRyxPQUFPLEdBQUcsTUFBTSxHQUFHLEVBQUUsVUFBVSxDQUFDO0FBQ2xEO0FBQ0EsSUFBSSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBSSxJQUFJLE9BQU87QUFDZixRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDckIsWUFBWSxLQUFLLEVBQUUsVUFBVTtBQUM3QixZQUFZLEtBQUssRUFBRSxJQUFJO0FBQ3ZCLFNBQVMsRUFBQztBQUNWO0FBQ0EsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ2pCLFFBQVEsS0FBSyxFQUFFLGdCQUFnQjtBQUMvQixRQUFRLEtBQUssRUFBRSxNQUFNO0FBQ3JCLFFBQVEsS0FBSyxFQUFFLElBQUk7QUFDbkIsUUFBUSxLQUFLLEVBQUUsUUFBUTtBQUN2QixRQUFRLGVBQWUsRUFBRSxLQUFLO0FBQzlCLFFBQVEsUUFBUSxFQUFFLElBQUk7QUFDdEIsUUFBUSxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxLQUFLO0FBQ25DLFlBQVksT0FBTyxDQUFDLGlEQUFpRCxFQUFFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNsSCxTQUFTO0FBQ1QsS0FBSyxFQUFFO0FBQ1AsUUFBUSxLQUFLLEVBQUUsWUFBWTtBQUMzQixRQUFRLEtBQUssRUFBRSxRQUFRO0FBQ3ZCLFFBQVEsS0FBSyxFQUFFLElBQUk7QUFDbkIsUUFBUSxLQUFLLEVBQUUsUUFBUTtBQUN2QixRQUFRLGVBQWUsRUFBRSxLQUFLO0FBQzlCLFFBQVEsUUFBUSxFQUFFLElBQUk7QUFDdEIsUUFBUSxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxLQUFLO0FBQ25DLFlBQVksT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDdEksU0FBUztBQUNUO0FBQ0EsS0FBSyxFQUFFO0FBQ1AsUUFBUSxLQUFLLEVBQUUsWUFBWTtBQUMzQixRQUFRLEtBQUssRUFBRSxNQUFNO0FBQ3JCLFFBQVEsUUFBUSxFQUFFLElBQUk7QUFDdEIsUUFBUSxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxLQUFLO0FBQ25DLFlBQVksT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0MsU0FBUztBQUNULEtBQUssQ0FBQyxDQUFDO0FBQ1A7QUFDQSxJQUFJLGFBQWEsQ0FBQyxjQUFjLENBQUM7QUFDakMsUUFBUSxHQUFHLEVBQUUsR0FBRztBQUNoQixRQUFRLE1BQU0sRUFBRSxLQUFLO0FBQ3JCLFFBQVEsV0FBVyxFQUFFLEtBQUs7QUFDMUIsUUFBUSxVQUFVLEVBQUUsS0FBSztBQUN6QixRQUFRLGNBQWMsRUFBRSxLQUFLO0FBQzdCLFFBQVEsYUFBYSxFQUFFLElBQUk7QUFDM0IsUUFBUSxVQUFVLEVBQUUsS0FBSztBQUN6QixRQUFRLFNBQVMsRUFBRSxJQUFJO0FBQ3ZCLFFBQVEsZUFBZSxFQUFFLE1BQU07QUFDL0IsWUFBWSxPQUFPLG1EQUFtRCxDQUFDO0FBQ3ZFLFNBQVM7QUFDVCxRQUFRLE9BQU8sRUFBRSxPQUFPO0FBQ3hCLFFBQVEsVUFBVSxFQUFFLFVBQVU7QUFDOUIsUUFBUSxPQUFPLEVBQUUsT0FBTztBQUN4QixRQUFRLFVBQVUsRUFBRSxPQUFPO0FBQzNCLFFBQVEsZUFBZSxFQUFFLE1BQU0sRUFBRSxPQUFPLG9HQUFvRyxDQUFDLEVBQUU7QUFDL0ksS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBOztBQzlEQztBQUVEO0FBQ08sTUFBTSxlQUFlLENBQUM7QUFDN0I7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQjtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxNQUFNLEdBQUc7QUFDbkI7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDL0M7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDaEQ7QUFDQSxRQUFRLHVCQUF1QixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsNEJBQTRCLEVBQUUsSUFBSTtBQUN0RixZQUFZLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQzNDLFlBQVksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNDO0FBQ0EsUUFBUSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDO0FBQzdDLFlBQVksZUFBZSxFQUFFLE1BQU0sRUFBRSxPQUFPLG1FQUFtRSxDQUFDLEVBQUU7QUFDbEgsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxLQUFLO0FBQ2pGLFlBQVksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUYsU0FBUyxDQUFDLENBQUM7QUFDWCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLElBQUksRUFBRTtBQUMzQixRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JDO0FBQ0EsWUFBWSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQyxZQUFZLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRCxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDMUI7QUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzFCLFFBQVEsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtBQUN2QztBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM1RCxRQUFRLElBQUksUUFBUSxHQUFHLENBQUMsd0NBQXdDLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUUsUUFBUSxJQUFJLG1CQUFtQixHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVEO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7QUFDN0IsWUFBWSxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNsQztBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxpQkFBaUI7QUFDbEYsWUFBWSxDQUFDLG1DQUFtQyxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0ZBQWtGLENBQUMsQ0FBQyxDQUFDO0FBQ3pKO0FBQ0EsUUFBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkU7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUQ7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sUUFBUSxHQUFHO0FBQ3JCO0FBQ0EsS0FBSztBQUNMOztBQ3BFQztBQUVEO0FBQ08sTUFBTSxVQUFVLENBQUM7QUFDeEI7QUFDQSxJQUFJLFdBQVcsQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFO0FBQzVDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUM7QUFDckM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUMsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3BELFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDNUM7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDekQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2hDO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyRjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUTtBQUN6QixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakM7QUFDQSxRQUFRLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0FBQ3BDO0FBQ0EsUUFBUSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDL0I7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ2hDLEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxlQUFlLEdBQUc7QUFDdEI7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFlBQVksS0FBSztBQUM3RztBQUNBO0FBQ0EsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2QztBQUNBLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN0QyxZQUFZLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDMUMsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RDLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QztBQUNBLFlBQVksSUFBSSxZQUFZLEtBQUssT0FBTyxFQUFFO0FBQzFDLGdCQUFnQixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQy9DLGFBQWEsTUFBTSxJQUFJLFlBQVksS0FBSyxRQUFRLEVBQUU7QUFDbEQsZ0JBQWdCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDOUMsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDMUMsYUFBYSxNQUFNLElBQUksWUFBWSxLQUFLLE1BQU0sRUFBRTtBQUNoRCxnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQyxnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMxQyxhQUFhO0FBQ2I7QUFDQSxTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7QUFDdEMsWUFBWSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDL0IsWUFBWSxLQUFLLEVBQUUsTUFBTTtBQUN6QixZQUFZLGdCQUFnQixFQUFFLEtBQUs7QUFDbkMsWUFBWSxVQUFVLEVBQUU7QUFDeEIsZ0JBQWdCLFNBQVMsRUFBRSxNQUFNO0FBQ2pDLGdCQUFnQixLQUFLLEVBQUUsS0FBSztBQUM1QixnQkFBZ0IsTUFBTSxFQUFFLEVBQUU7QUFDMUIsYUFBYTtBQUNiLFlBQVksYUFBYSxFQUFFLEtBQUs7QUFDaEMsWUFBWSxlQUFlLEVBQUU7QUFDN0IsZ0JBQWdCLGVBQWUsRUFBRSxNQUFNO0FBQ3ZDLGdCQUFnQixxQkFBcUIsRUFBRSxPQUFPO0FBQzlDLGdCQUFnQixjQUFjLEVBQUUsS0FBSztBQUNyQyxnQkFBZ0Isa0JBQWtCLEVBQUUsS0FBSztBQUN6QyxnQkFBZ0IsbUJBQW1CLEVBQUUsRUFBRTtBQUN2QyxhQUFhO0FBQ2IsWUFBWSxnQkFBZ0IsRUFBRTtBQUM5QixnQkFBZ0IsYUFBYSxFQUFFLEtBQUs7QUFDcEMsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksTUFBTSxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQy9DLFFBQVEsSUFBSSxJQUFJLENBQUMsZ0JBQWdCO0FBQ2pDLFlBQVksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDOUM7QUFDQSxLQUFLO0FBQ0wsSUFBSSxNQUFNLHFCQUFxQixDQUFDLElBQUksRUFBRTtBQUN0QztBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDM0IsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZDLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUNsRTtBQUNBLFlBQVksSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMxRjtBQUNBLFlBQVksSUFBSSxhQUFhLElBQUksQ0FBQztBQUNsQyxnQkFBZ0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQzFFLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUM1RDtBQUNBLFFBQVEsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDbkMsWUFBWSxRQUFRLEVBQUUsSUFBSTtBQUMxQixZQUFZLFFBQVEsRUFBRTtBQUN0QixnQkFBZ0IsUUFBUSxFQUFFLHFEQUFxRDtBQUMvRSxhQUFhO0FBQ2IsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksb0JBQW9CLEdBQUc7QUFDM0I7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7QUFDbEQsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSTtBQUN4RSxZQUFZLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7QUFDdEQsWUFBWSxDQUFDLEdBQUcsRUFBRSxRQUFRLEtBQUssSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzFFO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxnQkFBZ0IsR0FBRztBQUN2QjtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ2xDLFlBQVksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUs7QUFDaEQsZ0JBQWdCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyQyxnQkFBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEQsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDO0FBQzVCLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDOUIsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSztBQUM1QyxnQkFBZ0IsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3JDO0FBQ0EsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3hDLG9CQUFvQixPQUFPLEtBQUssQ0FBQztBQUNqQztBQUNBLGdCQUFnQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0RCxnQkFBZ0IsT0FBTyxJQUFJLENBQUM7QUFDNUIsYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLFlBQVksR0FBRztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO0FBQ3ZCLFlBQVksT0FBTyxJQUFJLENBQUM7QUFDeEI7QUFDQSxRQUFRLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekM7QUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPO0FBQ3BCLFlBQVksT0FBTyxLQUFLLENBQUM7QUFDekI7QUFDQSxRQUFRLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDOUMsUUFBUSxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDOUI7QUFDQSxRQUFRLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDcEU7QUFDQSxRQUFRLElBQUksT0FBTyxFQUFFO0FBQ3JCLFlBQVksSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxZQUFZLElBQUksSUFBSTtBQUNwQixnQkFBZ0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLFNBQVM7QUFDVDtBQUNBLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0E7O0FDdE1DO0FBQ00sTUFBTSxrQkFBa0IsQ0FBQztBQUNoQztBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDOUIsS0FBSztBQUNMLElBQUksTUFBTSxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUU7QUFDeEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxxQ0FBcUMsRUFBRSxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0FBQ3pHO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNoRTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFO0FBQy9DO0FBQ0EsWUFBWSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLO0FBQzVEO0FBQ0EsZ0JBQWdCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyQztBQUNBLGdCQUFnQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuRTtBQUNBLGdCQUFnQixJQUFJLFFBQVE7QUFDNUIsb0JBQW9CLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RHLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FDOUJRLE1BQU0seUJBQXlCLENBQUM7QUFDeEM7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzlCLEtBQUs7QUFDTCxJQUFJLE1BQU0sU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFO0FBQ3hEO0FBQ0EsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUMvQztBQUNBLFFBQVEsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMscUNBQXFDLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUNwRztBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNoRTtBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFO0FBQy9DO0FBQ0EsWUFBWSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLO0FBQzVEO0FBQ0EsZ0JBQWdCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyQztBQUNBLGdCQUFnQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuRTtBQUNBLGdCQUFnQixJQUFJLFFBQVE7QUFDNUIsb0JBQW9CLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3RHLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FDOUJRLE1BQU0sdUJBQXVCLENBQUM7QUFDdEM7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzlCLEtBQUs7QUFDTCxJQUFJLE1BQU0sU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFO0FBQ3hEO0FBQ0EsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUMvQztBQUNBLFFBQVEsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMscUNBQXFDLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDakc7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDaEU7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRTtBQUMvQztBQUNBLFlBQVksSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSztBQUM1RDtBQUNBLGdCQUFnQixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDckM7QUFDQSxnQkFBZ0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkU7QUFDQSxnQkFBZ0IsSUFBSSxRQUFRO0FBQzVCLG9CQUFvQixNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0RyxhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDs7QUM3QlEsTUFBTSwwQkFBMEIsQ0FBQztBQUN6QztBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDOUIsS0FBSztBQUNMLElBQUksTUFBTSxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUU7QUFDeEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBQy9DO0FBQ0EsUUFBUSxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxxQ0FBcUMsRUFBRSxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUU7QUFDL0M7QUFDQSxZQUFZLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUs7QUFDNUQ7QUFDQSxnQkFBZ0IsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3JDO0FBQ0EsZ0JBQWdCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25FO0FBQ0EsZ0JBQWdCLElBQUksUUFBUTtBQUM1QixvQkFBb0IsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdEcsYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUM5QkM7QUFNRDtBQUNPLE1BQU0sYUFBYSxTQUFTLFVBQVUsQ0FBQztBQUM5QztBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsS0FBSyxDQUFDLGdCQUFnQixFQUFFLDBCQUEwQixFQUFDO0FBQzNEO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0FBQzNELFFBQVEsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUkseUJBQXlCLEVBQUUsQ0FBQztBQUN6RSxRQUFRLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLHVCQUF1QixFQUFFLENBQUM7QUFDckUsUUFBUSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSwwQkFBMEIsRUFBRSxDQUFDO0FBQzNFLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUNuQztBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxNQUFNLEdBQUc7QUFDbkI7QUFDQSxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN2QjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxhQUFhLEtBQUs7QUFDbEcsWUFBWSxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUU7QUFDakM7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUN0QztBQUNBLGdCQUFnQixJQUFJO0FBQ3BCO0FBQ0Esb0JBQW9CLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO0FBQy9DLHdCQUF3QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDOUU7QUFDQSx3QkFBd0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDL0MsNEJBQTRCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSw0QkFBNEIsT0FBTztBQUNuQyx5QkFBeUI7QUFDekI7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsbURBQW1ELENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRTtBQUNqRztBQUNBLHdCQUF3QixJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25DLDRCQUE0QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekUsNEJBQTRCLE9BQU87QUFDbkMseUJBQXlCO0FBQ3pCO0FBQ0Esd0JBQXdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDckUsNEJBQTRCLE9BQU87QUFDbkM7QUFDQSx3QkFBd0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoRTtBQUNBLHdCQUF3QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxrQkFBa0I7QUFDL0UsNEJBQTRCLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEg7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksWUFBWTtBQUN6RSw0QkFBNEIsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN0SDtBQUNBLHdCQUF3QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxhQUFhO0FBQzFFLDRCQUE0QixNQUFNLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdIO0FBQ0Esd0JBQXdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxJQUFJLGtCQUFrQjtBQUMvRSw0QkFBNEIsTUFBTSxJQUFJLENBQUMsMEJBQTBCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5SDtBQUNBLHdCQUF3QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxVQUFVO0FBQ3ZFLDRCQUE0QixNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNIO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDNUI7QUFDQSxvQkFBb0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLGlCQUFpQjtBQUNqQjtBQUNBLGdCQUFnQixJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ3RDO0FBQ0EsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEM7QUFLRDtBQUNPLE1BQU0sY0FBYyxDQUFDO0FBQzVCO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1RDtBQUNBLFFBQVEsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUU7QUFDL0M7QUFDQSxZQUFZLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUs7QUFDNUQsZ0JBQWdCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNyQztBQUNBLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRO0FBQ2pDLG9CQUFvQixNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDM0csYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzVDO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3JFO0FBQ0EsUUFBUSxJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUN6RDtBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pELFlBQVksSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdkc7QUFDQSxZQUFZLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMvQztBQUNBLFlBQVksSUFBSSxXQUFXO0FBQzNCLGdCQUFnQixXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdDO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERDO0FBRUQ7QUFDTyxNQUFNLFlBQVksQ0FBQztBQUMxQjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDM0IsUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQyxZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUMxQixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzFCLFFBQVEsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRztBQUNuQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRDtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO0FBQy9CLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSx5QkFBeUIsRUFBRSxJQUFJO0FBQ25GLFlBQVksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7QUFDM0MsWUFBWSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0M7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO0FBQzNDLFlBQVksZUFBZSxFQUFFLE1BQU0sRUFBRSxPQUFPLHlEQUF5RCxDQUFDLEVBQUU7QUFDeEcsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLEtBQUssS0FBSztBQUMvRSxZQUFZLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzFGLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtBQUNwQztBQUNBLFFBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsUUFBUSxJQUFJLFFBQVEsR0FBRyxDQUFDLGtDQUFrQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLFFBQVEsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyRCxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN0RDtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO0FBQzFCLFlBQVksSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDL0I7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLGtCQUFrQixFQUFFLGlCQUFpQjtBQUNoRixZQUFZLENBQUMsK0JBQStCLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQywwRUFBMEUsQ0FBQyxDQUFDLENBQUM7QUFDN0k7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEU7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sUUFBUSxHQUFHO0FBQ3JCO0FBQ0EsS0FBSztBQUNMOztBQ3ZFQztBQUVEO0FBQ08sTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDOUIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLFNBQVMsQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN4RDtBQUNBLFFBQVEsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDL0M7QUFDQSxRQUFRLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGtEQUFrRCxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEUsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDeEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsUUFBUSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0FBQzVGO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEc7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNwRSxRQUFRLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7QUFDbEY7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JGO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDNUM7QUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3BHLFFBQVEsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7QUFDcEM7QUFDQSxRQUFRLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRSxDQUFDLENBQUMsQ0FBQztBQUNySDtBQUNBO0FBQ0EsUUFBUSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDckUsS0FBSztBQUNMO0FBQ0EsSUFBSSxvQkFBb0IsR0FBRztBQUMzQjtBQUNBLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDcEc7QUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQUU7QUFDcEMsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxTQUFTLE1BQU07QUFDZixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSx1QkFBdUIsQ0FBQyxRQUFRLEVBQUU7QUFDNUMsUUFBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDMUUsUUFBUSxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDNUMsUUFBUSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkM7QUFDQSxRQUFRLElBQUksY0FBYyxHQUFHLENBQUMsbUNBQW1DLEVBQUUsUUFBUSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDOUc7QUFDQSxRQUFRLElBQUk7QUFDWjtBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDaEQsWUFBWSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDakM7QUFDQSxZQUFZLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDakMsZ0JBQWdCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFnQixJQUFJLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqSSxnQkFBZ0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JFLGdCQUFnQixPQUFPO0FBQ3ZCLGFBQWE7QUFDYjtBQUNBLFlBQVksSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQ7QUFDQSxZQUFZLFdBQVcsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakU7QUFDQSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSztBQUM3QyxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQztBQUMxRixhQUFhLENBQUMsQ0FBQztBQUNmO0FBQ0EsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUNyQyxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZGLGdCQUFnQixJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3REO0FBQ0EsYUFBYSxNQUFNO0FBQ25CLGdCQUFnQixJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3RFO0FBQ0EsYUFBYTtBQUNiLFlBQVksSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkc7QUFDQSxZQUFZLElBQUksa0JBQWtCO0FBQ2xDLGdCQUFnQixNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RDtBQUNBLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQixZQUFZLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN4RSxZQUFZLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUMzRjtBQUNBLFlBQVksSUFBSUEsaUJBQWUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMvQztBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxrQkFBa0IsQ0FBQyxRQUFRLEVBQUU7QUFDdkMsUUFBUSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdkM7QUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDL0Q7QUFDQSxRQUFRLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25HLFFBQVEsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFFBQVEsSUFBSSxTQUFTLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pGO0FBQ0EsUUFBUSxJQUFJO0FBQ1o7QUFDQTtBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0M7QUFDQSxZQUFZLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDakMsZ0JBQWdCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFnQixJQUFJLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqSSxnQkFBZ0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hFLGdCQUFnQixPQUFPO0FBQ3ZCLGFBQWE7QUFDYjtBQUNBLFlBQVksSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNqQyxnQkFBZ0IsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEQ7QUFDQSxnQkFBZ0IsTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hGO0FBQ0EsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSztBQUM1QyxvQkFBb0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUM7QUFDekYsaUJBQWlCLENBQUMsQ0FBQztBQUNuQixhQUFhO0FBQ2I7QUFDQSxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2hDLGdCQUFnQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUM1RSxnQkFBZ0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNqRCxhQUFhO0FBQ2IsaUJBQWlCO0FBQ2pCLGdCQUFnQixJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVELGFBQWE7QUFDYjtBQUNBLFlBQVksSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzdGO0FBQ0EsWUFBWSxJQUFJLGFBQWE7QUFDN0IsZ0JBQWdCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RDtBQUNBLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQjtBQUNBLFlBQVksSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ25FLFlBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUN0RjtBQUNBLFlBQVksSUFBSUEsaUJBQWUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM5RDtBQUNBLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMxQztBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksd0JBQXdCLENBQUMsUUFBUSxFQUFFO0FBQ3ZDLFFBQVEsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkc7QUFDQSxRQUFRLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNO0FBQ3ZDLFlBQVksT0FBTztBQUNuQjtBQUNBLFFBQVEsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pGO0FBQ0EsUUFBUSxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU07QUFDbEMsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELFFBQVEsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFFBQVEsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQSxRQUFRLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDN0QsUUFBUSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3pELFFBQVEsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDMUUsUUFBUSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzdELFFBQVEsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzRCxRQUFRLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRjtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQzdMQztBQUdEO0FBQ08sTUFBTSxxQkFBcUIsQ0FBQztBQUNuQztBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDOUIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sU0FBUyxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3hEO0FBQ0EsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUMvQztBQUNBLFFBQVEsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsa0RBQWtELEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pHO0FBQ0E7QUFDQSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuQztBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQzlFLFFBQVEsSUFBSSxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztBQUM1RixRQUFRLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7QUFDcEcsUUFBUSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEU7QUFDQSxRQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQztBQUNsRztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFRLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUN0RTtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUM1QixZQUFZLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sdUJBQXVCLENBQUMsUUFBUSxFQUFFO0FBQzVDLFFBQVEsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzFFLFFBQVEsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzVDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN4QyxRQUFRLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUM3QixRQUFRLElBQUk7QUFDWjtBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxtQ0FBbUMsRUFBRSxRQUFRLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDO0FBQ2xIO0FBQ0EsWUFBWSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ2pDLGdCQUFnQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNoRSxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakksZ0JBQWdCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRSxnQkFBZ0IsT0FBTztBQUN2QixhQUFhO0FBQ2IsWUFBWSxJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqRCxZQUFZLElBQUksWUFBWSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEo7QUFDQSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSztBQUM5QyxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFDO0FBQ3BHLGFBQWEsQ0FBQyxDQUFDO0FBQ2Y7QUFDQSxZQUFZLENBQUMsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLG1DQUFtQyxFQUFFLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUM7QUFDekc7QUFDQSxZQUFZLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDakMsZ0JBQWdCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFnQixJQUFJLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqSSxnQkFBZ0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JFLGdCQUFnQixPQUFPO0FBQ3ZCLGFBQWE7QUFDYixZQUFZLGVBQWUsR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QyxZQUFZLElBQUksWUFBWSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEo7QUFDQSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSztBQUM5QyxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFDO0FBQ3BHLGFBQWEsQ0FBQyxDQUFDO0FBQ2Y7QUFDQTtBQUNBLFlBQVksV0FBVyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDNUQ7QUFDQSxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ3JDLGdCQUFnQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDdkYsZ0JBQWdCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEQsZ0JBQWdCLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMUQ7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6RixnQkFBZ0IsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDbkYsYUFBYTtBQUNiLFlBQVksSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkc7QUFDQSxZQUFZLElBQUksa0JBQWtCO0FBQ2xDLGdCQUFnQixNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUM5RTtBQUNBLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQixZQUFZLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN4RSxZQUFZLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUMzRixZQUFZLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEQsWUFBWSxJQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELFlBQVksSUFBSUEsaUJBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkQsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDL0M7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksTUFBTSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUU7QUFDekM7QUFDQSxRQUFRLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMxQyxRQUFRLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RSxRQUFRLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM5QztBQUNBLFFBQVEsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkcsUUFBUSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzlFO0FBQ0E7QUFDQSxRQUFRLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksa0JBQWtCLENBQUMsQ0FBQztBQUM3RTtBQUNBLFFBQVEsSUFBSSx5QkFBeUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ2xGO0FBQ0EsUUFBUSxJQUFJLFVBQVUsQ0FBQyxjQUFjLEtBQUssa0JBQWtCO0FBQzVELFlBQVkseUJBQXlCLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDdEUsYUFBYSxJQUFJLFVBQVUsQ0FBQyxjQUFjLEtBQUssYUFBYTtBQUM1RCxZQUFZLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQzdCLFFBQVEsSUFBSTtBQUNaO0FBQ0EsWUFBWSxJQUFJLENBQUMsR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN0RjtBQUNBLFlBQVksSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNqQyxnQkFBZ0IsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDaEUsZ0JBQWdCLElBQUksSUFBSSxHQUFHLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pJLGdCQUFnQixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkUsZ0JBQWdCLE9BQU87QUFDdkIsYUFBYTtBQUNiLFlBQVksSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQsWUFBWSxXQUFXLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFO0FBQ0EsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEtBQUs7QUFDN0MsZ0JBQWdCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUM7QUFDNUYsYUFBYSxDQUFDLENBQUM7QUFDZixTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDcEI7QUFDQSxZQUFZLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUMxRSxZQUFZLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUM5RjtBQUNBLFlBQVksSUFBSUEsaUJBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkQsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDakQ7QUFDQSxLQUFLO0FBQ0w7O0FDbEtDO0FBR0Q7QUFDTyxNQUFNLGVBQWUsQ0FBQztBQUM3QjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDOUIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sU0FBUyxDQUFDLGVBQWUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3hEO0FBQ0EsUUFBUSxJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUMvQztBQUNBLFFBQVEsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsNENBQTRDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNGO0FBQ0E7QUFDQSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuQztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUM5RSxRQUFRLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7QUFDNUYsUUFBUSxJQUFJLENBQUMsNEJBQTRCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBQ3BHLFFBQVEsSUFBSSxDQUFDLHNCQUFzQixHQUFHLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xFO0FBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEc7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDMUUsUUFBUSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDdEU7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDNUIsWUFBWSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekUsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsSUFBSSxNQUFNLHVCQUF1QixDQUFDLFFBQVEsRUFBRTtBQUM1QyxRQUFRLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUMxRSxRQUFRLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QztBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDeEMsUUFBUSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDN0IsUUFBUSxJQUFJO0FBQ1o7QUFDQSxZQUFZLElBQUksQ0FBQyxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsbUNBQW1DLEVBQUUsUUFBUSxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQztBQUNsSDtBQUNBLFlBQVksSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNqQyxnQkFBZ0IsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDaEUsZ0JBQWdCLElBQUksSUFBSSxHQUFHLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pJLGdCQUFnQixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckUsZ0JBQWdCLE9BQU87QUFDdkIsYUFBYTtBQUNiLFlBQVksSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQsWUFBWSxJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xKO0FBQ0EsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEtBQUs7QUFDOUMsZ0JBQWdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBQztBQUNwRyxhQUFhLENBQUMsQ0FBQztBQUNmO0FBQ0EsWUFBWSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxtQ0FBbUMsRUFBRSxRQUFRLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO0FBQ3pHO0FBQ0EsWUFBWSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ2pDLGdCQUFnQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNoRSxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakksZ0JBQWdCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRSxnQkFBZ0IsT0FBTztBQUN2QixhQUFhO0FBQ2IsWUFBWSxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0MsWUFBWSxJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xKO0FBQ0EsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEtBQUs7QUFDOUMsZ0JBQWdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBQztBQUNwRyxhQUFhLENBQUMsQ0FBQztBQUNmO0FBQ0E7QUFDQSxZQUFZLFdBQVcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzVEO0FBQ0EsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtBQUNyQyxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZGLGdCQUFnQixJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3RELGdCQUFnQixJQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFEO0FBQ0EsYUFBYSxNQUFNO0FBQ25CO0FBQ0EsZ0JBQWdCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDekYsZ0JBQWdCLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ25GLGFBQWE7QUFDYixZQUFZLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZHO0FBQ0EsWUFBWSxJQUFJLGtCQUFrQjtBQUNsQyxnQkFBZ0IsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDOUU7QUFDQSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDcEIsWUFBWSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDeEUsWUFBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLDRCQUE0QixDQUFDLENBQUM7QUFDM0YsWUFBWSxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xELFlBQVksSUFBSSxDQUFDLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0RCxZQUFZLElBQUlBLGlCQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25ELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0FBQy9DO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sb0JBQW9CLENBQUMsUUFBUSxFQUFFO0FBQ3pDO0FBQ0EsUUFBUSxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDMUMsUUFBUSxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDekUsUUFBUSxJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDOUM7QUFDQSxRQUFRLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25HLFFBQVEsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM5RTtBQUNBO0FBQ0EsUUFBUSxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLGtCQUFrQixDQUFDLENBQUM7QUFDN0U7QUFDQSxRQUFRLElBQUkseUJBQXlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUNsRjtBQUNBLFFBQVEsSUFBSSxVQUFVLENBQUMsY0FBYyxLQUFLLGtCQUFrQjtBQUM1RCxZQUFZLHlCQUF5QixDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3RFLGFBQWEsSUFBSSxVQUFVLENBQUMsY0FBYyxLQUFLLGFBQWE7QUFDNUQsWUFBWSx5QkFBeUIsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNqRTtBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUM3QixRQUFRLElBQUk7QUFDWjtBQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEY7QUFDQSxZQUFZLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7QUFDakMsZ0JBQWdCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2hFLGdCQUFnQixJQUFJLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqSSxnQkFBZ0IsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZFLGdCQUFnQixPQUFPO0FBQ3ZCLGFBQWE7QUFDYixZQUFZLElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pELFlBQVksV0FBVyxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRTtBQUNBLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxLQUFLO0FBQzdDLGdCQUFnQixJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFDO0FBQzVGLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3BCO0FBQ0EsWUFBWSxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDMUUsWUFBWSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFDOUY7QUFDQSxZQUFZLElBQUlBLGlCQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25ELFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2pEO0FBQ0EsS0FBSztBQUNMOztBQ2pLQztBQU1EO0FBQ08sTUFBTSxlQUFlLFNBQVMsVUFBVSxDQUFDO0FBQ2hEO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEIsUUFBUSxLQUFLLENBQUMsWUFBWSxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDckQ7QUFDQSxRQUFRLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFDdkQsUUFBUSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO0FBQ2pFLFFBQVEsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBQ3JELFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUNuQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0EsUUFBUSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDdkI7QUFDQTtBQUNBLFFBQVEsaUJBQWlCLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JEO0FBQ0E7QUFDQSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuQztBQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsYUFBYSxLQUFLO0FBQy9HO0FBQ0EsWUFBWSxJQUFJLGdCQUFnQixJQUFJLENBQUMsSUFBSSxhQUFhLElBQUksQ0FBQyxFQUFFO0FBQzdEO0FBQ0EsZ0JBQWdCLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNsRjtBQUNBLGdCQUFnQixJQUFJLENBQUMsSUFBSSxFQUFFO0FBQzNCLG9CQUFvQixPQUFPLEtBQUssQ0FBQztBQUNqQyxpQkFBaUI7QUFDakI7QUFDQSxnQkFBZ0IsSUFBSSxJQUFJLEtBQUssZUFBZSxJQUFJLElBQUksS0FBSyxlQUFlLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUNoRyxvQkFBb0IsSUFBSUEsaUJBQWUsQ0FBQyxvQkFBb0IsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlHLG9CQUFvQixPQUFPLEtBQUssQ0FBQztBQUNqQyxpQkFBaUI7QUFDakI7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdEO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsWUFBWSxPQUFPLElBQUksQ0FBQztBQUN4QixTQUFTLENBQUMsQ0FBQztBQUNYO0FBQ0EsUUFBUSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxhQUFhLEtBQUs7QUFDbEc7QUFDQSxZQUFZLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtBQUNqQztBQUNBLGdCQUFnQixJQUFJO0FBQ3BCO0FBQ0Esb0JBQW9CLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO0FBQy9DLHdCQUF3QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDOUU7QUFDQSx3QkFBd0IsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDL0MsNEJBQTRCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSw0QkFBNEIsT0FBTztBQUNuQyx5QkFBeUI7QUFDekI7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFGO0FBQ0Esd0JBQXdCLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDbkMsNEJBQTRCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6RSw0QkFBNEIsT0FBTztBQUNuQyx5QkFBeUI7QUFDekI7QUFDQSx3QkFBd0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNyRSw0QkFBNEIsT0FBTztBQUNuQztBQUNBLHdCQUF3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hFO0FBQ0Esd0JBQXdCLElBQUksSUFBSSxJQUFJLGVBQWU7QUFDbkQsNEJBQTRCLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDcEg7QUFDQSw2QkFBNkIsSUFBSSxJQUFJLElBQUksZUFBZTtBQUN4RCw0QkFBNEIsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN6SDtBQUNBLDZCQUE2QixJQUFJLElBQUksSUFBSSxTQUFTO0FBQ2xELDRCQUE0QixNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuSDtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzVCO0FBQ0Esb0JBQW9CLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxRQUFRLEdBQUc7QUFDckI7QUFDQSxLQUFLO0FBQ0w7O0FDcEdDO0FBRUQ7QUFDTyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pDO0FBQ0EsSUFBSSxXQUFXLEdBQUc7QUFDbEI7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJLE1BQU0sVUFBVSxDQUFDLElBQUksRUFBRTtBQUMzQixRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JDLFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsWUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxVQUFVLENBQUMsR0FBRyxFQUFFO0FBQzFCLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDMUIsUUFBUSxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEQsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDcEQ7QUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZTtBQUNqQyxZQUFZLE9BQU87QUFDbkI7QUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDOUMsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sUUFBUSxHQUFHO0FBQ3JCO0FBQ0EsS0FBSztBQUNMOztBQ3JDQztBQUNEO0FBQ08sTUFBTSxzQkFBc0IsQ0FBQztBQUNwQztBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLE1BQU0sTUFBTSxHQUFHO0FBQ25CO0FBQ0EsUUFBUSxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNqRDtBQUNBO0FBQ0EsUUFBUSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM5QztBQUNBO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO0FBQ3RDLFlBQVksUUFBUSxFQUFFLENBQUM7QUFDdkIsWUFBWSxLQUFLLEVBQUUsU0FBUztBQUM1QixZQUFZLGdCQUFnQixFQUFFLEtBQUs7QUFDbkMsWUFBWSxTQUFTLEVBQUUsS0FBSztBQUM1QixZQUFZLFVBQVUsRUFBRTtBQUN4QixnQkFBZ0IsU0FBUyxFQUFFLE1BQU07QUFDakMsZ0JBQWdCLEtBQUssRUFBRSxLQUFLO0FBQzVCLGdCQUFnQixNQUFNLEVBQUUsRUFBRTtBQUMxQixhQUFhO0FBQ2IsWUFBWSxhQUFhLEVBQUUsS0FBSztBQUNoQyxZQUFZLGVBQWUsRUFBRTtBQUM3QixnQkFBZ0IsZUFBZSxFQUFFLE1BQU07QUFDdkMsZ0JBQWdCLHFCQUFxQixFQUFFLE9BQU87QUFDOUMsZ0JBQWdCLGNBQWMsRUFBRSxLQUFLO0FBQ3JDLGdCQUFnQixrQkFBa0IsRUFBRSxLQUFLO0FBQ3pDLGdCQUFnQixtQkFBbUIsRUFBRSxFQUFFO0FBQ3ZDLGFBQWE7QUFDYixZQUFZLGNBQWMsRUFBRTtBQUM1QixnQkFBZ0IsZUFBZSxFQUFFLElBQUk7QUFDckMsZ0JBQWdCLGdCQUFnQixFQUFFLElBQUk7QUFDdEMsZ0JBQWdCLFlBQVksRUFBRSxJQUFJO0FBQ2xDLGdCQUFnQiwwQkFBMEIsRUFBRSxJQUFJO0FBQ2hELGdCQUFnQiw0QkFBNEIsRUFBRSxLQUFLO0FBQ25ELGdCQUFnQixzQkFBc0IsRUFBRSxJQUFJO0FBQzVDLGFBQWE7QUFDYixZQUFZLGdCQUFnQixFQUFFO0FBQzlCLGdCQUFnQixhQUFhLEVBQUUsS0FBSztBQUNwQyxhQUFhO0FBQ2IsU0FBUyxDQUFDLENBQUM7QUFDWCxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUksTUFBTSxRQUFRLEdBQUc7QUFDckI7QUFDQSxLQUFLO0FBQ0w7O0FDdERDO0FBQ0Q7QUFDQSxJQUFJLGFBQWEsR0FBRyxZQUFZO0FBQ2hDO0FBQ0E7QUFDQSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2hCLFFBQVEsYUFBYSxFQUFFLFVBQVUsR0FBRyxFQUFFO0FBQ3RDLFlBQVksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3pCLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QyxTQUFTO0FBQ1QsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDaEIsUUFBUSxZQUFZLEVBQUUsWUFBWTtBQUNsQyxZQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLFNBQVM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQO0FBQ0E7QUFDQTtBQUNBLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDaEIsUUFBUSxNQUFNLEVBQUUsWUFBWTtBQUM1QixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDekMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6QyxTQUFTO0FBQ1QsUUFBUSxPQUFPLEVBQUUsWUFBWTtBQUM3QixZQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4QyxTQUFTO0FBQ1QsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDaEIsUUFBUSxTQUFTLEVBQUUsVUFBVSxRQUFRLEVBQUU7QUFDdkMsWUFBWSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSztBQUNwRCxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSztBQUMvRCxvQkFBb0IsSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO0FBQzNDLHdCQUF3QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMscUJBQXFCO0FBQ3JCLG9CQUFvQixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEMsaUJBQWlCLENBQUMsQ0FBQztBQUNuQixhQUFhLENBQUMsQ0FBQztBQUNmLFNBQVM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQO0FBQ0EsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUNoQixRQUFRLFNBQVMsRUFBRSxnQkFBZ0IsR0FBRyxFQUFFO0FBQ3hDO0FBQ0E7QUFDQSxZQUFZLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUM1QjtBQUNBLFlBQVksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQ3JJO0FBQ0EsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLFlBQVksSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5QyxZQUFZLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUM7QUFDQSxZQUFZLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEQsWUFBWSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xEO0FBQ0EsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU07QUFDcEMsZ0JBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLGlGQUFpRixDQUFDLENBQUMsQ0FBQztBQUNySTtBQUNBLFlBQVksWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUM7QUFDQSxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTTtBQUNwQyxnQkFBZ0IsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZHO0FBQ0EsWUFBWSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QztBQUNBLFlBQVksWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDLFlBQVksWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDO0FBQ0EsWUFBWSxJQUFJO0FBQ2hCO0FBQ0EsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekQ7QUFDQSxnQkFBZ0IsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BDO0FBQ0EsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO0FBQzdDO0FBQ0Esb0JBQW9CLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQztBQUNBLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ3ZDLHdCQUF3QixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN6RSxxQkFBcUIsTUFBTTtBQUMzQix3QkFBd0IsTUFBTSxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDbkQscUJBQXFCO0FBQ3JCO0FBQ0Esb0JBQW9CLElBQUksSUFBSSxHQUFHLENBQUMsbUNBQW1DLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRixvQkFBb0IsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxvQkFBb0IsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckYsaUJBQWlCLE1BQU07QUFDdkIsb0JBQW9CLElBQUksSUFBSSxHQUFHLG9EQUFvRCxDQUFDO0FBQ3BGLG9CQUFvQixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLG9CQUFvQixZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyRixpQkFBaUI7QUFDakIsZ0JBQWdCLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDeEIsZ0JBQWdCLElBQUksZUFBZSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BFLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVCxLQUFLLEVBQUM7QUFDTjtBQUNBLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDaEIsUUFBUSxTQUFTLEVBQUUsZ0JBQWdCLEdBQUcsRUFBRSxZQUFZLEVBQUU7QUFDdEQ7QUFDQSxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzFCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0EsWUFBWSxJQUFJLFlBQVksRUFBRTtBQUM5QjtBQUNBLGdCQUFnQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEQ7QUFDQSxnQkFBZ0IsSUFBSSxDQUFDLE9BQU87QUFDNUIsb0JBQW9CLE9BQU87QUFDM0IsYUFBYTtBQUNiO0FBQ0EsWUFBWSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDeEQ7QUFDQSxZQUFZLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDMUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDL0MsZ0JBQWdCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakQsYUFBYSxDQUFDLENBQUM7QUFDZjtBQUNBLFlBQVksSUFBSTtBQUNoQjtBQUNBLGdCQUFnQixJQUFJLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDaEQsb0JBQW9CLElBQUksRUFBRSxRQUFRO0FBQ2xDLG9CQUFvQixNQUFNLEVBQUUsTUFBTTtBQUNsQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25CO0FBQ0EsZ0JBQWdCLElBQUksWUFBWSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pEO0FBQ0EsZ0JBQWdCLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksWUFBWSxLQUFLLEtBQUssRUFBRTtBQUN0RTtBQUNBLG9CQUFvQixJQUFJLFlBQVksRUFBRTtBQUN0QztBQUNBLHdCQUF3QixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDO0FBQ3RGLDRCQUE0QixJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RDtBQUNBLHdCQUF3QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDeEM7QUFDQSx3QkFBd0IsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRTtBQUNqRSw0QkFBNEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDeEYseUJBQXlCLE1BQU07QUFDL0IsNEJBQTRCLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZELHlCQUF5QjtBQUN6QjtBQUNBLHdCQUF3QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2pELDRCQUE0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekMsNEJBQTRCLFNBQVMsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUNwSDtBQUNBLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZO0FBQ3ZELGdDQUFnQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RSw2QkFBNkIsQ0FBQyxDQUFDO0FBQy9CLHlCQUF5QjtBQUN6QjtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsZ0JBQWdCLE9BQU8sWUFBWSxDQUFDO0FBQ3BDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN4QixnQkFBZ0IsT0FBTztBQUN2QixvQkFBb0IsTUFBTSxFQUFFO0FBQzVCLHdCQUF3QixlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMscUJBQXFCO0FBQ3JCLGlCQUFpQixDQUFDO0FBQ2xCLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVCxLQUFLLEVBQUM7QUFDTixFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsQ0FBQyxhQUFhLEdBQUc7O0FDdk0vQjtBQWVEO0FBQ0EsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3pCO0FBQ0E7QUFDQSxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzlCO0FBQ0E7QUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFCO0FBQ0E7QUFDQSxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDM0IsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDOUI7QUFDQUMsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDN0NBLFFBQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDbkRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pDQSxRQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQy9DQSxRQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDdkRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNDQSxRQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyQ0EsUUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNqREEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDM0NBLFFBQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUNqRUEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUM1REEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDakRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDbkRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDckRBLFFBQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNDQSxRQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNsREEsUUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQzFEQSxRQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDIn0=