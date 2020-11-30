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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIkNsaWVudFNyYy9yb3V0ZXIuanMiLCJDbGllbnRTcmMvZGFzaGJvYXJkL2Rhc2hib2FyZFBhZ2UuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVzUGFnZS5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsLmpzIiwiQ2xpZW50U3JjL2NvbnNvbGUyLmpzIiwiQ2xpZW50U3JjL2hlbHBlcnMuanMiLCJDbGllbnRTcmMvaGFuZGxlcnMuanMiLCJDbGllbnRTcmMvbm90aWZpY2F0aW9uLmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxEZWxldGVFbmdpbmUuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFicmlja3MuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFGYWN0b3J5LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxQcmV2aWV3LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxVc2Vycy5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsRXJyb3IuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVEZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9kb3RtaW10YWJsZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pblBhZ2UuanMiLCJDbGllbnRTcmMvYWRtaW4vYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9tZ3QuanMiLCJDbGllbnRTcmMvYXV0aC5qcyIsIkNsaWVudFNyYy9ob21lL2hvbWVQYWdlLmpzIiwiQ2xpZW50U3JjL3NldHRpbmdzL3NldHRpbmdzUGFnZS5qcyIsIkNsaWVudFNyYy9ib290c3RyYXBUYWJsZXMvZW5naW5lQm9vdHN0cmFwVGFibGUuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZXNQYWdlLmpzIiwiQ2xpZW50U3JjL3dpemFyZC93aXphcmRQYWdlLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZVNxbC5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VOZXcuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUVkaXQuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNQYWdlLmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzQXp1cmVTcWwuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzUGFycXVldC5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc05ld1BhZ2UuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNEZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9lbnRpdGllcy9lbnRpdGllc05ld1ZlcnNpb25QYWdlLmpzIiwiQ2xpZW50U3JjL2V4dGVuc2lvbnMuanMiLCJDbGllbnRTcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsi77u/Ly8gQHRzLWNoZWNrIFxyXG5cclxuZXhwb3J0IGNsYXNzIHJvdXRlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAocHNlKSA9PiB0aGlzLl9vbkxvY2F0aW9uQ2hhbmdlKHBzZSkpO1xyXG5cclxuICAgICAgICB0aGlzLl9pbml0KGxvY2F0aW9uLmhyZWYpO1xyXG5cclxuICAgICAgICAvLyBjYWxsZWQgZXZlcnkgdGltZSB0aGUgZG9jdW1lbnQgaXMgcmVhZHlcclxuICAgICAgICAvLyBldmVudCBhZnRlciBhbiBoaXN0b3J5IGNhbGxiYWNrIHdoaXRoIHBvcHN0YXRlXHJcbiAgICAgICAgJCgoKSA9PiB0aGlzLl9ydW4oKSk7XHJcblxyXG5cclxuICAgIH1cclxuICBcclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZ2V0IHRoZSBjdXJyZW50IHZpZXcgbmFtZSAodGhlIC97Vmlld30gbmFtZSBwYWdlKVxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VmlldygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VmlldztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHt7W119fSBnZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAqL1xyXG4gICAgZ2V0UXVlcnlQYXJhbWV0ZXJzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRRdWVyeVBhcmFtZXRlcnM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge1VSTH0gZ2V0IHRoZSBjdXJyZW50IHVybFxyXG4gICAgICovXHJcbiAgICBnZXRDdXJyZW50VXJsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBnZXQgdGhlIGN1cnJlbnQgc3RhdGUgKHVzZWx5IGFmdGVyIGEgcG9zdCwgYW5kIGRlY2xhcmVkIGZyb20gdGhlIG5vZGUgdmlldyBpbiB7c3RhdGV9IG9iamVjdClcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFN0YXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0IHRoZSByb3V0ZXIgb24gZWFjaCB1cmwgcmVxdWVzdGVkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jIGN1cnJlbnQgbG9jYXRpb24gaHJlZlxyXG4gICAgICovXHJcbiAgICBfaW5pdChsb2MpIHtcclxuICAgICAgICAvL3RoaXMuY3VycmVudFVybCA9IG5ldyB1cmlqcyhsb2MpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVybCA9IG5ldyBVUkwobG9jKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IHZpZXdcclxuICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdGhpcy5jdXJyZW50VXJsLnBhdGhuYW1lO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGhlIHF1ZXJ5IHBhcmFtZXRlcnNcclxuICAgICAgICB0aGlzLmN1cnJlbnRVcmwuc2VhcmNoUGFyYW1zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge1BvcFN0YXRlRXZlbnR9IHBvcFN0YXRlRXZlbnQgXHJcbiAgICAqL1xyXG4gICAgX29uTG9jYXRpb25DaGFuZ2UocG9wU3RhdGVFdmVudCkge1xyXG4gICAgICAgIHZhciBzcmNFbGVtID0gcG9wU3RhdGVFdmVudC5zcmNFbGVtZW50O1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKCFzcmNFbGVtIHx8ICFzcmNFbGVtLmxvY2F0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlICYmIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQpXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKTtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX2luaXQoc3JjRWxlbS5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB0aGlzLl9ydW4oKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgX2NyZWF0ZUluc3RhbmNlKGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgdmFyIGZhY3RvcnkgPSBjb25zdHJ1Y3Rvci5iaW5kLmFwcGx5KGNvbnN0cnVjdG9yLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHJldHVybiBuZXcgZmFjdG9yeSgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW3N0YXRlXSBcclxuICAgICAqL1xyXG4gICAgbmF2aWdhdGVUbyh1cmwsIHN0YXRlKSB7XHJcblxyXG4gICAgICAgIGlmICh1cmwgPT09IHRoaXMuY3VycmVudFVybC5wYXRobmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUgPyBzdGF0ZSA6IHt9LCBcIlwiLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aE5hbWUgOiBwYXRobmFtZSB1cmlcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHBhZ2VIYW5kbGVyXHJcbiAgICAqL1xyXG4gICAgcmVnaXN0ZXIocGF0aE5hbWUsIHBhZ2VIYW5kbGVyKSB7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0KHBhdGhOYW1lLCBwYWdlSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgX3J1bigpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gJChcIiNyb3V0ZXJTdGF0ZVwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN0YXRlKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IEpTT04ucGFyc2UodGhpcy5jdXJyZW50U3RhdGUpO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudEtleTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXAuZm9yRWFjaCgodiwgaykgPT4ge1xyXG4gICAgICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAoaywgJ2knKTtcclxuICAgICAgICAgICAgbGV0IGlzTWF0Y2ggPSByLnRlc3QodGhpcy5jdXJyZW50Vmlldyk7XHJcbiAgICAgICAgICAgIGlmIChpc01hdGNoKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudEtleSA9IGs7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50S2V5KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50UGFnZUN0b3IgPSB0aGlzLm1hcC5nZXQoY3VycmVudEtleSk7XHJcblxyXG4gICAgICAgIGlmICghY3VycmVudFBhZ2VDdG9yKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLl9jcmVhdGVJbnN0YW5jZShjdXJyZW50UGFnZUN0b3IpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFBhZ2UpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2Uub25Mb2FkKSB7XHJcbiAgICAgICAgICAgICQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZS5vbkxvYWQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlciBoYXMgbG9hZGVkIHBhZ2UgXCIgKyB0aGlzLmN1cnJlbnRWaWV3KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZS5vblVubG9hZCkge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ2JlZm9yZXVubG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQoKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLy8gc2luZ2xldG9uXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyByb3V0ZXIoKTtcclxuXHJcblxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHJvdXRlciBmcm9tIFwiLi4vcm91dGVyLmpzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIGRhc2hib2FyZFBhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSW5kZXggZ2V0IHRoZSBjdXJyZW50IHBhZ2UgaW5kZXhcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVmcmVzaChwYWdlSW5kZXgpIHtcclxuICAgIH1cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBlbmdpbmVzUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihpZCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLl9zaG93blBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9zaG93UGFuZWwgPSAoZSkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMuX3VubG9hZFBhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBcInJpZ2h0XCI7XHJcbiAgICAgICAgdGhpcy5fY2VudGVyID0gXCJcIjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGUoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhbmVsKCkgJiYgdGhpcy5wYW5lbCgpLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgbW9kYWxIdG1sRGl2ID0gdGhpcy5fZ2VuZXJhdGVNb2RhbEh0bWwoKTtcclxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKG1vZGFsSHRtbERpdik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBzbSgpIHtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBsZygpIHtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiIG1vZGFsLWxnXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIHhsKCkge1xyXG4gICAgICAgIHRoaXMuX2xhcmdlID0gXCIgbW9kYWwteGxcIjtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICByZWFkb25seSgpIHtcclxuICAgICAgICB0aGlzLl9kYXRhX3JlYWRvbmx5ID0gJ2RhdGEtYmFja2Ryb3A9XCJzdGF0aWNcIiBkYXRhLWtleWJvYXJkPVwiZmFsc2VcIiAnO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbnRlcigpIHtcclxuICAgICAgICB0aGlzLl9jZW50ZXIgPSBcIm1vZGFsLWRpYWxvZy1jZW50ZXJlZCBtb2RhbC1kaWFsb2ctc2Nyb2xsYWJsZVwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblNob3duKHNob3duUGFuZWxFdmVudCkgeyB0aGlzLnBhbmVsKCkub24oJ3Nob3duLmJzLm1vZGFsJywgc2hvd25QYW5lbEV2ZW50KSB9XHJcblxyXG4gICAgb25TaG93KHNob3dQYW5lbEV2ZW50KSB7IHRoaXMucGFuZWwoKS5vbignc2hvdy5icy5tb2RhbCcsIHNob3dQYW5lbEV2ZW50KSB9XHJcblxyXG4gICAgb25VbkxvYWQodW5sb2FkUGFuZWxFdmVudCkgeyB0aGlzLnBhbmVsKCkub24oJ2hpZGUuYnMubW9kYWwnLCB1bmxvYWRQYW5lbEV2ZW50KSB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gKi9cclxuICAgIHBhbmVsKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1gKSB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtKUXVlcnk8SFRNTEJ1dHRvbkVsZW1lbnQ+fSAqL1xyXG4gICAgc3VibWl0QnV0dG9uKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1TdWJtaXRCdXR0b25gKSB9XHJcblxyXG4gICAgLyoqICBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0gKi9cclxuICAgIGRlbGV0ZUJ1dHRvbigpIHtcclxuICAgICAgICByZXR1cm4gJChgIyR7dGhpcy5pZH1EZWxldGVCdXR0b25gKVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZUJ1dHRvblRleHQodGV4dCkge1xyXG4gICAgICAgICQoYCMke3RoaXMuaWR9RGVsZXRlQnV0dG9uVGV4dGApLnRleHQodGV4dCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0qL1xyXG4gICAgY2xvc2VCdXR0b24oKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfUNsb3NlQnV0dG9uYCkgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxEaXZFbGVtZW50Pn0qL1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgYm9keSgpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9Qm9keWApIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MSFJFbGVtZW50Pn0qL1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGl0bGUoKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfVRpdGxlYCkgfVxyXG5cclxuXHJcbiAgICBfZ2VuZXJhdGVNb2RhbEh0bWwoKSB7XHJcblxyXG4gICAgICAgIGxldCBtb2RhbCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwgJHt0aGlzLl9wb3NpdGlvbn0gZmFkZVwiIGlkPVwiJHt0aGlzLmlkfVwiIHRhYmluZGV4PVwiLTFcIiAke3RoaXMuX2RhdGFfcmVhZG9ubHl9YXJpYS1sYWJlbGxlZGJ5PVwiJHt0aGlzLmlkfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nJHt0aGlzLl9sYXJnZX0gJHt0aGlzLl9jZW50ZXJ9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudCR7dGhpcy5fbGFyZ2V9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDUgY2xhc3M9XCJtb2RhbC10aXRsZVwiIGlkPVwiJHt0aGlzLmlkfVRpdGxlXCI+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiIGlkPVwiJHt0aGlzLmlkfUJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYXJrIGJ0bi1zbVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgaWQ9XCIke3RoaXMuaWR9Q2xvc2VCdXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXVuZG9cIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDbG9zZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtXCIgaWQ9XCIke3RoaXMuaWR9U3VibWl0QnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1zYXZlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3VibWl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi1zbVwiIGlkPVwiJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJhc2gtYWx0XCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCIke3RoaXMuaWR9RGVsZXRlQnV0dG9uVGV4dFwiPkRlbGV0ZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1vZGFsO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu79cclxuXHJcbmV4cG9ydCBjbGFzcyBjb25zb2xlMiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxEaXZFbGVtZW50Pn0gcGFyZW50T3ZlcmZsb3dFbGVtZW50XHJcbiAgICAgKiovXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBwYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyID0gZWxlbWVudDtcclxuICAgICAgICB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQgPSBwYXJlbnRPdmVyZmxvd0VsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxUb3AgPSB0aGlzLl9wYXJlbnRPdmVyZmxvd0VsZW1lbnQucG9zaXRpb24oKS50b3A7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cuUHJpc20gPSB3aW5kb3cuUHJpc20gfHwge307XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHdpbmRvdy5QcmlzbS5tYW51YWwgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLl9tZ3Rsb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZ3Rsb2dpbicpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBfdXNlck5hbWUoKSB7XHJcblxyXG4gICAgICAgIGxldCB1c2VyTmFtZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9tZ3Rsb2dpbiAmJiB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscykge1xyXG5cclxuICAgICAgICAgICAgbGV0IG1haWwgPSB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscy5lbWFpbDtcclxuICAgICAgICAgICAgaWYgKCFtYWlsKVxyXG4gICAgICAgICAgICAgICAgbWFpbCA9IHRoaXMuX21ndGxvZ2luLnVzZXJEZXRhaWxzLnVzZXJQcmluY2lwYWxOYW1lO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5hbWVNYXRjaCA9IG1haWwubWF0Y2goL14oW15AXSopQC8pO1xyXG4gICAgICAgICAgICB1c2VyTmFtZSA9IG5hbWVNYXRjaCA/IG5hbWVNYXRjaFsxXSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdXNlck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgX3Njcm9sbFRvRW5kKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9jb25zb2xlMi5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbmV3UG9zID0gdGhpcy5faW5pdGlhbFRvcCArIGhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50LnNjcm9sbFRvKG5ld1BvcywgMTAwKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kT2JqZWN0KGpzb25PYmplY3QpIHtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGxldCBqc29uU3RyaW5nID0gUHJpc20uaGlnaGxpZ2h0KEpTT04uc3RyaW5naWZ5KGpzb25PYmplY3QsIG51bGwsIDIpLCBQcmlzbS5sYW5ndWFnZXMuanNvbiwgJ2pzb24nKTtcclxuXHJcbiAgICAgICAgbGV0IHN0ciA9IFwiPHByZSBjbGFzcz0nbWwtMyBtci0zIG10LTMnIHN0eWxlPSdiYWNrZ3JvdW5kLWNvbG9yOndoaXRlO3doaXRlLXNwYWNlOnByZS13cmFwO3dpZHRoOjkwJTttYXgtaGVpZ2h0OjI1MHB4Oyc+PGNvZGU+XCI7XHJcbiAgICAgICAgc3RyICs9IGpzb25TdHJpbmc7XHJcbiAgICAgICAgc3RyICs9IFwiPC9jb2RlPjwvcHJlPlwiO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFwcGVuZFdhcm5pbmcobGluZSkge1xyXG5cclxuICAgICAgICBsZXQgc3RyID0gYDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3dcIj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdhcm5pbmdcIj4ke3RoaXMuX3VzZXJOYW1lKCl9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj46PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2FybmluZ1wiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhcHBlbmRFcnJvcihsaW5lKSB7XHJcblxyXG4gICAgICAgIGxldCBzdHIgPSBgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvd1wiPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtZGFuZ2VyXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPn4kJm5ic3A7PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtd2hpdGVcIj4ke2xpbmV9PC9zcGFuPmA7XHJcbiAgICAgICAgc3RyICs9ICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5hcHBlbmQoc3RyKTtcclxuICAgICAgICB0aGlzLl9zY3JvbGxUb0VuZCgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2cobGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGluZm8obGluZSkgeyB0aGlzLmFwcGVuZExpbmUobGluZSk7IH1cclxuICAgIGVycm9yKGxpbmUpIHsgdGhpcy5hcHBlbmRFcnJvcihsaW5lKTsgfVxyXG4gICAgd2FybihsaW5lKSB7IHRoaXMuYXBwZW5kV2FybmluZyhsaW5lKTsgfVxyXG5cclxuXHJcbiAgICBhcHBlbmRMaW5lKGxpbmUpIHtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHN0ciA9IGA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93XCI+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXN1Y2Nlc3NcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsYXkobXMpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufVxyXG5cclxuLy9leHBvcnQgZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4vLyAgICB0aGlzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4vLyAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4vL31cclxuLy9leHBvcnQgZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuLy8gICAgdGhpcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuLy8gICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG5cclxuLy99XHJcblxyXG4vLy8qKlxyXG4vLyAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhX3VybFxyXG4vLyAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4vLyAqL1xyXG4vL2V4cG9ydCBmdW5jdGlvbiBsb2FkUGFydGlhbEFzeW5jKGRhdGFfdXJsLCBlbGVtZW50KSB7XHJcbi8vICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbi8vICAgICAgICBlbGVtZW50LmxvYWQoZGF0YV91cmwsIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpID0+IHtcclxuLy8gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4vLyAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4vLyAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuLy8gICAgICAgIH0pO1xyXG4vLyAgICB9KTtcclxuLy99XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgaGFuZGxlcnMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWV0aG9kcyA9IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdNZXRob2RcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lIHx8ICFuZXdNZXRob2QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gaGFuZGxlcnMgYWxyZWFkeSwgY3JlYXRlIGFuIGVtcHR5IGFycmF5XHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0pIHtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQcmV2ZW50aW5nIGFkZGluZyB0aGUgc2FtZSBoYW5kbGVyIG11bHRpcGxlIHRpbWVzLlxyXG4gICAgICAgIGlmICh0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV0uaW5kZXhPZihuZXdNZXRob2QpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhZGQgdGhlIG1ldGhvZCB0byB0aGUgaGFuZGxlciBsaXN0XHJcbiAgICAgICAgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdLnB1c2gobmV3TWV0aG9kKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbnJlZ2lzdGVyIGFuIGhhbmRsZXJcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIG1ldGhvZCBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gbWV0aG9kICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kTmFtZSwgbWV0aG9kKSB7XHJcbiAgICAgICAgaWYgKCFtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIGdldCBhbGwgaGFuZGxlcnMgd2l0aCB0aGlzIG1ldGhvZCBuYW1lXHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcblxyXG4gICAgICAgIC8vIGlmIGhhbmRsZXJzIGRvIG5vdCBleGlzdHMsIHJldHVyblxyXG4gICAgICAgIGlmICghaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uIGV4aXN0aW5nXHJcbiAgICAgICAgaWYgKG1ldGhvZCkge1xyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleCBpbiBhbGwgaGFuZGxlcnNcclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlSWR4ID0gaGFuZGxlcnMuaW5kZXhPZihtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgd2UgZm91bmQgaXQsIG1ha2UgYSBzcGxpY2UgaW4gdGhlIGhhbmRsZXJzIGxpc3RcclxuICAgICAgICAgICAgaWYgKHJlbW92ZUlkeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShyZW1vdmVJZHgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIG5vIG1vcmUgaGFuZGxlcnMsIGRlbGV0ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm1ldGhvZHNbbWV0aG9kTmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0ICAgXHJcbiAgICAgKi9cclxuICAgIGludm9rZSh0YXJnZXQsIC4uLnBhcmFtZXRlcnMpIHtcclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBtZXRob2RzIGFycmF5IHRvIGludm9rZVxyXG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLm1ldGhvZHNbdGFyZ2V0LnRvTG93ZXJDYXNlKCldO1xyXG5cclxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGF0IGxlYXN0IG9uIG1ldGhvZCBpbiB0aGUgbWV0aG9kcyBhcnJheSB0byBpbnZva2VcclxuICAgICAgICBpZiAobWV0aG9kcykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgbWV0aG9kcykge1xyXG4gICAgICAgICAgICAgICAgICAgIG0uYXBwbHkoX3RoaXMsIHBhcmFtZXRlcnMpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBIGNhbGxiYWNrIGZvciB0aGUgbWV0aG9kICR7dGFyZ2V0LnRvTG93ZXJDYXNlKCl9IHRocmV3IGVycm9yICcke2V9Jy5gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgTm8gY2xpZW50IG1ldGhvZCB3aXRoIHRoZSBuYW1lICcke3RhcmdldC50b0xvd2VyQ2FzZSgpfScgZm91bmQuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vd3d3cm9vdC9saWIvc2lnbmFsci9kaXN0L2Jyb3dzZXIvc2lnbmFsci5qc1wiIC8+XHJcblxyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuL2hlbHBlcnMuanNcIjtcclxuaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tIFwiLi9oYW5kbGVycy5qc1wiXHJcblxyXG4vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBub3RpZmljYXRpb24ge1xyXG5cclxuICAgIC8vIHNpbmdsZXRvblxyXG4gICAgc3RhdGljIF9jdXJyZW50O1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7bm90aWZpY2F0aW9ufSAqL1xyXG4gICAgc3RhdGljIGdldCBjdXJyZW50KCkge1xyXG4gICAgICAgIGlmICghbm90aWZpY2F0aW9uLl9jdXJyZW50KVxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uX2N1cnJlbnQgPSBuZXcgbm90aWZpY2F0aW9uKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBub3RpZmljYXRpb24uX2N1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvLyBldmVudHNcclxuICAgIHN0YXRpYyBPblN0YXJ0ZWQgPSBcIk9uU3RhcnRlZFwiO1xyXG4gICAgc3RhdGljIE9uU3RvcHBlZCA9IFwiT25TdG9wcGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0ZWQgPSBcIk9uQ29ubmVjdGVkXCI7XHJcbiAgICBzdGF0aWMgT25Db25uZWN0aW5nID0gXCJPbkNvbm5lY3RpbmdcIjtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlcnMgPSBuZXcgaGFuZGxlcnMoKTtcclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gbmV3IHNpZ25hbFIuSHViQ29ubmVjdGlvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICAuY29uZmlndXJlTG9nZ2luZyhzaWduYWxSLkxvZ0xldmVsLk5vbmUpXHJcbiAgICAgICAgICAgIC53aXRoVXJsKCcvbm90aWZpY2F0aW9ucycpXHJcbiAgICAgICAgICAgIC53aXRoQXV0b21hdGljUmVjb25uZWN0KClcclxuICAgICAgICAgICAgLmNvbmZpZ3VyZUxvZ2dpbmcoc2lnbmFsUi5Mb2dMZXZlbC5UcmFjZSlcclxuICAgICAgICAgICAgLmJ1aWxkKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbnJlY29ubmVjdGluZyhlcnJvciA9PiB0aGlzLl9jb25zb2xlLmxvZyhlcnJvcikpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbmNsb3NlKGVycm9yID0+IHRoaXMub25Db25uZWN0aW9uRXJyb3IoZXJyb3IpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uKFwiY29ubmVjdGVkXCIsIChfKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0YXJ0KCkge1xyXG4gICAgICAgIGxldCByZXRyeUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3RhcnRpbmcpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIHdoaWxlICghdGhpcy5faXNDb25uZWN0ZWQgJiYgcmV0cnlDb3VudCA8IDUpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHJ5Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgPT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZyk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc3RhcnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXdhaXQgZGVsYXkoMTUwMCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkIHx8IHJldHJ5Q291bnQgPj0gNSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1N0YXJ0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55IHRyaWVzIHRvIGNvbm5lY3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uU3RhcnRlZCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN0b3AoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbm5lY3Rpb24uc3RhdGUgIT0gc2lnbmFsUi5IdWJDb25uZWN0aW9uU3RhdGUuRGlzY29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5zdG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLmludm9rZShub3RpZmljYXRpb24uT25TdG9wcGVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb24obWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9uKG1ldGhvZCwgaGFuZGxlcik7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub24obWV0aG9kLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBvZmYobWV0aG9kLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQgfHxcclxuICAgICAgICAgICAgbWV0aG9kID09IG5vdGlmaWNhdGlvbi5PblN0b3BwZWQpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9mZihtZXRob2QsIGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBvbkNvbm5lY3Rpb25FcnJvcihlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciAmJiBlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUge1xyXG5cclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxEZWxldGVFbmdpbmUobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLmNsaWNrKGFzeW5jIChldmVudCkgPT4geyBhd2FpdCB0aGlzLmRlbGV0ZUVuZ2luZUFzeW5jKGV2ZW50KSB9KTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXY+Jm5ic3A7PC9kaXY+XCIpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXYgY2xhc3M9J2NvbnNvbGUnPjwvZGl2PlwiKTtcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIEpRdWVyeTxIVE1MRGl2RWxlbWVudD4gKi9cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlRWxlbWVudCA9IHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmZpbmQoJy5jb25zb2xlJyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlID0gbmV3IGNvbnNvbGUyKHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQsIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpKTtcclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIGV2ZW50IGZyb20gc2lnbmFsciBhYm91dCBkZXBsb3ltZW50XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgY29ubmVjdGluZy4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RlZC4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgZW5naW5lIHJlcXVlc3QgaWQsIGFuZCBzZXQgaXQgZ2xvYmFseVxyXG4gICAgICAgIHRoaXMuZW5naW5lSWQgPSBidXR0b24uZGF0YSgnZW5naW5lLWlkJylcclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZVJlcXVlc3RSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVxdWVzdFJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgJChsb2NhdGlvbikuYXR0cignaHJlZicsICcvQWRtaW4vSW5kZXgnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZVJlcXVlc3QgPSBhd2FpdCBlbmdpbmVSZXF1ZXN0UmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAvLyB0aW1lb3V0IG9mIHRoZSBwYWdlIGZvciBzb21lIHJlYXNvbiA/XHJcbiAgICAgICAgaWYgKCFlbmdpbmVSZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgICQobG9jYXRpb24pLmF0dHIoJ2hyZWYnLCAnLycpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLnNob3coKTtcclxuXHJcbiAgICAgICAgJChcIjxkaXYgY2xhc3M9J20tMic+QXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBlbmdpbmUgPGI+XCIgKyBlbmdpbmVSZXF1ZXN0LmVuZ2luZU5hbWUgKyBcIjwvYj4gPzwvZGl2PlwiKS5pbnNlcnRCZWZvcmUodGhpcy5kZWxldGVDb25zb2xlRWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiUmVhZHkgdG8gZGVsZXRlLiBQbGVhc2UgcHJlc3MgJ0RlbGV0ZScgYnV0dG9uIHRvIHN0YXJ0LlwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtKUXVlcnkuQ2xpY2tFdmVudDxIVE1MQnV0dG9uRWxlbWVudCwgbnVsbCwgSFRNTEJ1dHRvbkVsZW1lbnQsIEhUTUxCdXR0b25FbGVtZW50Pn0gZXZ0ICovXHJcbiAgICBhc3luYyBkZWxldGVFbmdpbmVBc3luYyhldnQpIHtcclxuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5lbmdpbmVJZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoXCJVbmFibGUgdG8gcmV0cmlldmUgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLi4uLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gR2V0IG5vdGlmaWNhdGlvbiBoZWxwZXJcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuICAgICAgICAvLyBzdWJzY3JpYmUgdG8gdGhpcyBkZXBsb3ltZW50IChmb3IgdGhpcyB1c2VyKVxyXG4gICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LmNvbm5lY3Rpb24uaW52b2tlKCdTdWJzY3JpYmVEZXBsb3ltZW50QXN5bmMnLCB0aGlzLmVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJXYWl0aW5nIGZvciBhbiBhZ2VudCB0byBlbnF1ZXVlIHRoZSBlbmdpbmUgZHJvcCBvcGVyYXRpb24uLi5cIik7XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgICBoZWFkZXJzLmFwcGVuZChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGxldCB1cmxEZWxldGlvbiA9IGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWA7XHJcblxyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybERlbGV0aW9uLCB7IG1ldGhvZDogJ0RFTEVURScgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRFcnJvcihgVW5hYmxlIHRvIGRlbGV0ZSB0aGUgZW5naW5lIHJlcXVlc3Qgd2l0aCBJZCAke3RoaXMuZW5naW5lSWR9IGApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZHJvcEVuZ2luZVN0YXJ0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBhd2FpdCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZShkcm9wRW5naW5lU3RhcnQpXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwIHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cChtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZSA9IG5ldyBtb2RhbFBhbmVsKG1vZGFsX2RhdGFfdGFyZ2V0KS5sZygpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25TaG93bihlID0+IHRoaXMuc2hvd25QYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxFbmdpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB1bmVjZXNzYXJ5IGJ1dHRvbnNcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXY+Jm5ic3A7PC9kaXY+XCIpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXYgY2xhc3M9J2NvbnNvbGUnPjwvZGl2PlwiKTtcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIEpRdWVyeTxIVE1MRGl2RWxlbWVudD4gKi9cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5jb25zb2xlRWxlbWVudCA9IHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmZpbmQoJy5jb25zb2xlJyk7XHJcbiAgICAgICAgdGhpcy5jb25zb2xlID0gbmV3IGNvbnNvbGUyKHRoaXMuY29uc29sZUVsZW1lbnQsIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbi4uLmApXHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgZW5naW5lIHJlcXVlc3QgaWQsIGFuZCBzZXQgaXQgZ2xvYmFseVxyXG4gICAgICAgIHRoaXMuZW5naW5lSWQgPSBidXR0b24uZGF0YSgnZW5naW5lLWlkJylcclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZW5naW5lcy8ke3RoaXMuZW5naW5lSWR9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChlbmdpbmVSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lID0gYXdhaXQgZW5naW5lUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAvLyB0aW1lb3V0IG9mIHRoZSBwYWdlIGZvciBzb21lIHJlYXNvbiA/XHJcbiAgICAgICAgaWYgKCFlbmdpbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBSZXNvdXJjZSBncm91cCA8c3Ryb25nPiR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfTwvc3Ryb25nPiAuLi5gKVxyXG5cclxuICAgICAgICBsZXQgcmdSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3Jlc291cmNlZ3JvdXBzLyR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmdSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCByZXNvdXJjZSBncm91cCBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZUdyb3VwID0gYXdhaXQgcmdSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QocmVzb3VyY2VHcm91cCk7XHJcblxyXG4gICAgICAgIGxldCByZ0xpbmtSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3Jlc291cmNlZ3JvdXBzLyR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfS9saW5rYCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZDogcmVzb3VyY2VHcm91cC5pZCB9KSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmdMaW5rUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgZ3JvdXAgbGluay5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzb3VyY2VHcm91cExpbmsgPSBhd2FpdCByZ0xpbmtSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBBenVyZSByZXNvdXJjZSBncm91cCBsaW5rIDogPGEgaHJlZj0ke3Jlc291cmNlR3JvdXBMaW5rLnVyaX0gdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZUdyb3VwLm5hbWV9PC9hPmApXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEb25lLmApXHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcGluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9wcGVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbERhdGFicmlja3Mge1xyXG5cclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxEYXRhYnJpY2tzKG1vZGFsX2RhdGFfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbF9kYXRhX3RhcmdldCBtb2RhbCBhdHRyaWJ1dGUgZGF0YS10YXJnZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIC8vIEdldCB0aGUgc21hbGwgbW9kYWxcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLmxnKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwOiA8c3Ryb25nPiR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfTwvc3Ryb25nPi5gKVxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEYXRhYnJpY2tzIHdvcmtzcGFjZTogPHN0cm9uZz4ke2VuZ2luZS5jbHVzdGVyTmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEF6dXJlLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhYnJpY2tzLyR7ZW5naW5lLmlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhYnJpY2tzIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlID0gYXdhaXQgcmVzb3VyY2VSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QocmVzb3VyY2UpO1xyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VMaW5rUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX0vbGlua2AsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaWQ6IHJlc291cmNlLmlkIH0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZUxpbmtSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCByZXNvdXJjZSBsaW5rLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmsgPSBhd2FpdCByZXNvdXJjZUxpbmtSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBBenVyZSBEYXRhYnJpa3Mgd29ya3NwYWNlIGxpbms6IDxhIGhyZWY9XCIke3Jlc291cmNlTGluay51cml9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRGF0YWJyaWNrcyB3b3Jrc3BhY2UgbGluazogPGEgaHJlZj1cImh0dHBzOi8vJHtyZXNvdXJjZS5wcm9wZXJ0aWVzLndvcmtzcGFjZVVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlLm5hbWV9PC9hPmApXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gRGF0YWJyaWNrcy4uLmApXHJcblxyXG4gICAgICAgIHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhYnJpY2tzLyR7ZW5naW5lLmlkfS9jbHVzdGVyYCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGRhdGFicmlja3MgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEb25lLmApXHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcGluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9wcGVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbERhdGFGYWN0b3J5IHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGF0YUZhY3RvcnkobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyByZW1vdmUgdW5lY2Vzc2FyeSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuY29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuY29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24uLi5gKVxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZSA9IGF3YWl0IGVuZ2luZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgUmVzb3VyY2UgZ3JvdXAgPHN0cm9uZz4ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX08L3N0cm9uZz4gLi4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRGF0YSBmYWN0b3J5IFYyOiA8c3Ryb25nPiR7ZW5naW5lLmZhY3RvcnlOYW1lfTwvc3Ryb25nPi5gKVxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQXp1cmUuLi5gKVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2RhdGFmYWN0b3JpZXMvJHtlbmdpbmUuaWR9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChyZXNvdXJjZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGRhdGEgZmFjdG9yeSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlTGlua1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9L2xpbmtgLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGlkOiByZXNvdXJjZS5pZCB9KSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VMaW5rUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgZ3JvdXAgbGluay5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzb3VyY2VMaW5rID0gYXdhaXQgcmVzb3VyY2VMaW5rUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgQXp1cmUgcmVzb3VyY2UgZ3JvdXAgbGluayA6IDxhIGhyZWY9JHtyZXNvdXJjZUxpbmsudXJpfSB0YXJnZXQ9XCJfYmxhbmtcIj4ke3Jlc291cmNlLm5hbWV9PC9hPmApXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBEb25lLmApXHJcblxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICghZGVwbG95KVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZGVwbG95LnN0YXRlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJFcnJvclwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcGluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9wcGVkXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsUHJldmlldyB7XHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsUHJldmlldyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldyA9IG5ldyBtb2RhbFBhbmVsKG1vZGFsX2RhdGFfdGFyZ2V0KS54bCgpLmNlbnRlcigpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxQcmV2aWV3O1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkudGV4dCgnTG9hZGluZyAuLi4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdmFyIGVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VOYW1lID0gYnV0dG9uLmRhdGEoJ2RhdGEtc291cmNlLW5hbWUnKVxyXG4gICAgICAgIHZhciBzY2hlbWFOYW1lID0gYnV0dG9uLmRhdGEoJ3NjaGVtYS1uYW1lJylcclxuICAgICAgICB2YXIgdGFibGVOYW1lID0gYnV0dG9uLmRhdGEoJ3RhYmxlLW5hbWUnKVxyXG5cclxuICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHByZXZpZXdSb3dzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9BenVyZVNxbERhdGFiYXNlLyR7ZW5naW5lSWR9LyR7ZGF0YVNvdXJjZU5hbWV9L3RhYmxlcy8ke3NjaGVtYU5hbWV9LyR7dGFibGVOYW1lfS9wcmV2aWV3YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJldmlld1Jvd3NSZXNwb25zZS5zdGF0dXMgIT0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJldmlld1Jvd3MgPSBhd2FpdCBwcmV2aWV3Um93c1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocHJldmlld1Jvd3MubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5hcHBlbmQoXCI8dGFibGUgaWQ9J3RhYmxlJz48L3RhYmxlPlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdzEgPSBwcmV2aWV3Um93c1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbHVtbnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBvIGluIHJvdzEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1ucy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkOiBvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IG9cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKCcjdGFibGUnKS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHByZXZpZXdSb3dzXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLnRleHQoJ05vIHJvd3MuLi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yUHJldmlld1wiLCBlKS5zaG93KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsVXNlcnMge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFVzZXJzKG1vZGFsX2RhdGFfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbF9kYXRhX3RhcmdldCBtb2RhbCBhdHRyaWJ1dGUgZGF0YS10YXJnZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIC8vIEdldCB0aGUgc21hbGwgbW9kYWxcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkuc20oKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMub25TaG93bihlID0+IHRoaXMuc2hvd25QYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsVXNlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLnRleHQoJ0xvYWRpbmcgLi4uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG4gICAgICAgIHZhciB1c2Vyc0lkc1ZhbCA9IGJ1dHRvbi5kYXRhKCd1c2Vycy1pZCcpIC8vIEV4dHJhY3QgaW5mbyBmcm9tIGRhdGEtKiBhdHRyaWJ1dGVzXHJcblxyXG4gICAgICAgIGlmICghdXNlcnNJZHNWYWwgfHwgdXNlcnNJZHNWYWwgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkudGV4dCgnTm90aGluZyB0byBzaG93LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXNlcnNJZHMgPSB1c2Vyc0lkc1ZhbC5zcGxpdCgnLCcpLm1hcCh2ID0+IHYudHJpbSgpKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1c2Vyc0lkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA9PT0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB1c2VySWQgPSB1c2Vyc0lkc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdXNlcklkIHx8IHVzZXJJZCA9PSAnJylcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5hcHBlbmQoXHJcbiAgICAgICAgICAgICAgICBcIjxkaXYgY2xhc3M9J20tMycgc3R5bGU9J292ZXJmbG93OmF1dG87Jz48bWd0LXBlcnNvbiB1c2VyLWlkPSdcIiArIHVzZXJzSWRzW2ldICsgXCInIGZldGNoLWltYWdlPSd0cnVlJyBwZXJzb24tY2FyZD0naG92ZXInIHZpZXc9J3R3b0xpbmVzJz48L21ndC1wZXJzb24+PC9kaXY+XCJcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsRXJyb3Ige1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbF9kYXRhX3RhcmdldCBtb2RhbCBhdHRyaWJ1dGUgZGF0YS10YXJnZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kYWxfZGF0YV90YXJnZXQsIGVycm9yTWVzc2FnZSkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvck1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnhsKCkuY2VudGVyKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLnBhbmVsKCkubW9kYWwoJ3Nob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3IuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3IuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLnRpdGxlKCkudGV4dChcIkVycm9yXCIpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5ib2R5KCkudGV4dCh0aGlzLmVycm9yTWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcbiAgICB9XHJcblxyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3IuYm9keSgpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQge1xyXG4gICAgbW9kYWxQYW5lbFVzZXJzLFxyXG4gICAgbW9kYWxQYW5lbERlbGV0ZUVuZ2luZSxcclxuICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLFxyXG4gICAgbW9kYWxQYW5lbERhdGFicmlja3MsXHJcbiAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnlcclxufSBmcm9tIFwiLi4vbW9kYWwvaW5kZXguanNcIjtcclxuXHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgZW5naW5lRGV0YWlsc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50TWVtYmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE1lbWJlcnNcIik7XHJcblxyXG4gICAgICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUuaW5pdGlhbGl6ZShcInBhbmVsRGVsZXRlRW5naW5lXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLmluaXRpYWxpemUoXCJwYW5lbFJlc291cmNlR3JvdXBcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFicmlja3MuaW5pdGlhbGl6ZShcInBhbmVsRGF0YWJyaWNrc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnkuaW5pdGlhbGl6ZShcInBhbmVsRGF0YUZhY3RvcnlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSAkKFwiI0lkXCIpO1xyXG5cclxuICAgICAgICBpZiAoJChcIiNjb25zb2xlXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyID0gbmV3IGNvbnNvbGUyKCQoXCIjY29uc29sZVwiKSwgJCgnZGl2LmRvY2tpbmctZm9ybScpKTtcclxuXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LmNvbm5lY3Rpb24uaW52b2tlKCdTdWJzY3JpYmVEZXBsb3ltZW50QXN5bmMnLCB0aGlzLmlkLnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3llZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIG9uVW5sb2FkKCkge1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9mZihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/ZXhwb3J0IGNsYXNzIGRvdG1pbXRhYmxlIHtcclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZSgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZSwgdXJsLCB1cmxDb3VudCwgcGFnZVNpemUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLnVybENvdW50ID0gdXJsQ291bnQgPz8gdGhpcy51cmwgKyBcIi9jb3VudFwiO1xyXG5cclxuICAgICAgICB0aGlzLnNwaW5uZXIgPSAkKCcjc3Bpbm5lci0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gJCgnI3Rib2R5LScgKyBuYW1lKTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzID0gJCgnI3ByZXZpb3VzLScgKyBuYW1lKTtcclxuICAgICAgICB0aGlzLm5leHQgPSAkKCcjbmV4dC0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoID0gJCgnI3JlZnJlc2gtJyArIG5hbWUpO1xyXG5cclxuICAgICAgICAvLyBkaXNhYmxlIGJ1dHRvbnNcclxuICAgICAgICB0aGlzLnByZXZpb3VzLnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIHRoaXMubmV4dC5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGEgcGFnZVxyXG4gICAgICAgIHRoaXMucGFnZUluZGV4ID0gMDtcclxuICAgICAgICB0aGlzLml0ZW1zQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMucGFnZVNpemUgPSBwYWdlU2l6ZSA/PyAyO1xyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2guY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5ydW4oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcmV2aW91cy5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4IC0gMTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubmV4dC5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4ICsgMTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgbG9hZCgpIHtcclxuICAgICAgICBsZXQgdXJsID0gdGhpcy51cmwgKyAnP3BhZ2VJbmRleD0nICsgdGhpcy5wYWdlSW5kZXggKyAnJmNvdW50PScgKyB0aGlzLnBhZ2VTaXplO1xyXG5cclxuICAgICAgICB0aGlzLnNwaW5uZXIuc2hvdygpO1xyXG4gICAgICAgIC8vbGV0IGQgPSBhd2FpdCAkLmdldEpTT04odXJsKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib2R5LmxvYWQodXJsLCAoZCwgc3RhdHVzLCB4aHIpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gXCJlcnJvclwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWQgfHwgZC50cmltKCkgPT0gJycpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUm93cygnTm8gZGF0YScpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zcGlubmVyLmhpZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVEaXNhYmxlQnV0dG9ucygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBydW4oKSB7XHJcbiAgICAgICAgdGhpcy5zcGlubmVyLnNob3coKTtcclxuICAgICAgICB0aGlzLmNsZWFyUm93cygpO1xyXG5cclxuICAgICAgICAkLmdldEpTT04odGhpcy51cmxDb3VudCwgZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXNDb3VudCA9IGRhdGEuY291bnQ7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgICAgIH0pLmZhaWwoKGVycm9yKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZXJyb3JTdHJpbmcgPSBlcnJvci5yZXNwb25zZUpTT04gPyAoZXJyb3IucmVzcG9uc2VKU09OLmVycm9yID8/IGVycm9yLnJlc3BvbnNlSlNPTikgOiBlcnJvci5yZXNwb25zZVRleHQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFkZEZpcnN0Um93V2FybmluZyhlcnJvclN0cmluZyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5oaWRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlRGlzYWJsZUJ1dHRvbnMoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRGaXJzdFJvd1dhcm5pbmcodGV4dCkge1xyXG4gICAgICAgIHRoaXMuYm9keS5jaGlsZHJlbigndHInKS5hZGRDbGFzcygnYmctZGFuZ2VyJyk7XHJcbiAgICAgICAgdGhpcy5ib2R5LmNoaWxkcmVuKCd0cicpLmNoaWxkcmVuKCd0ZCcpLmFkZENsYXNzKCd0ZXh0LWxpZ2h0JykuYXBwZW5kKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyUm93cyh0ZXh0KSB7XHJcbiAgICAgICAgbGV0IGNvbHVtbnNDb3VudCA9IHRoaXMuYm9keS5wYXJlbnQoKS5maW5kKCd0aCcpLmxlbmd0aDtcclxuICAgICAgICBpZiAoIWNvbHVtbnNDb3VudClcclxuICAgICAgICAgICAgY29sdW1uc0NvdW50ID0gdGhpcy5ib2R5LnBhcmVudCgpLmZpbmQoJ3RyJykubGVuZ3RoO1xyXG4gICAgICAgIGlmICghY29sdW1uc0NvdW50KVxyXG4gICAgICAgICAgICBjb2x1bW5zQ291bnQgPSAxO1xyXG5cclxuICAgICAgICB0ZXh0ID0gdGV4dCA/PyAnJm5ic3A7JztcclxuXHJcbiAgICAgICAgdGhpcy5ib2R5Lmh0bWwoJzx0cj48dGQgY29sc3Bhbj0nICsgY29sdW1uc0NvdW50ICsgJz4nICsgdGV4dCArICc8L3RkPjwvdHI+Jyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGVuYWJsZURpc2FibGVCdXR0b25zKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYWdlSW5kZXggPD0gMClcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91cy5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXMucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblxyXG4gICAgICAgIGlmICgodGhpcy5wYWdlSW5kZXggKyAxKSAqIHRoaXMucGFnZVNpemUgPj0gdGhpcy5pdGVtc0NvdW50KVxyXG4gICAgICAgICAgICB0aGlzLm5leHQucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLm5leHQucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uL3JvdXRlci5qc1wiO1xyXG5pbXBvcnQgeyBkb3RtaW10YWJsZSB9IGZyb20gXCIuLi9kb3RtaW10YWJsZS5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgYWRtaW5QYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgIH1cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IGRlbGF5IH0gZnJvbSBcIi4uL2hlbHBlcnMuanNcIlxyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiO1xyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCJcclxuaW1wb3J0IHsgbW9kYWxQYW5lbFVzZXJzIH0gZnJvbSBcIi4uL21vZGFsL21vZGFsUGFuZWxVc2Vycy5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIGFkbWluRGVwbG95bWVudEVuZ2luZVBhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gJChcIiNFbmdpbmVWaWV3X0lkXCIpO1xyXG4gICAgICAgIHRoaXMuY29uc29sZTIgPSBuZXcgY29uc29sZTIoJChcIiNjb25zb2xlXCIpLCAkKCdkaXYuZG9ja2luZy1mb3JtJykpO1xyXG4gICAgICAgIHRoaXMubGF1bmNoQnV0dG9uID0gJCgnI2xhdW5jaCcpO1xyXG4gICAgICAgIHRoaXMubGF1bmNoQnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pZCB8fCAhdGhpcy5pZC52YWwoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZFdhcm5pbmcoXCJDYW4ndCBsYXVuY2ggZGVwbG95bWVudC4gTm8gZW5naW5lIHJlcXVlc3QgLi4uXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHN1YnNjcmliZSB0byBldmVudCBmcm9tIHNpZ25hbHIgYWJvdXQgZGVwbG95bWVudFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LmNvbm5lY3Rpb24uaW52b2tlKCdTdWJzY3JpYmVEZXBsb3ltZW50QXN5bmMnLCB0aGlzLmlkLnZhbCgpKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIlJlYWR5IHRvIGRlcGxveS5cIilcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIilcclxuICAgICAgICAgICAgdGhpcy5sYXVuY2hCdXR0b24ucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RpbmcuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgY29ubmVjdGVkLi4uXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdG9wcGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG4gICAgICAgIC8vIEp1c3QgaW4gY2FzZSBpdCdzIG5vdCBzdGFydGVkIChidXQgc2hvdWxkIGJlIGRvbmUgYWxyZWFkeSBmcm9tIGhvbWVQYWdlLmpzKVxyXG4gICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHRoaXMubGF1bmNoQnV0dG9uLmNsaWNrKGFzeW5jIChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBMYXVuY2ggYSB2YWxpZGF0aW9uIGJlZm9yZVxyXG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9ICQoXCJmb3JtXCIpLnZhbGlkKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxhdW5jaEpvYkFzeW5jKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYXN5bmMgbGF1bmNoSm9iQXN5bmMoKSB7XHJcbiAgICAgICAgdGhpcy5jb25zb2xlMi5jbGVhcigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJEZXBsb3ltZW50IHN0YXJ0ZWQuXCIpXHJcbiAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIilcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlkIHx8ICF0aGlzLmlkLnZhbCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kV2FybmluZyhcIkNhbid0IGxhdW5jaCBkZXBsb3ltZW50LiBObyBlbmdpbmUgcmVxdWVzdCAuLi5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiU2F2aW5nIGRlcGxveW1lbnQgcHJvcGVydGllcy4uLlwiKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gRmlyc3QsIHNhdmUgdGhlIGRlcGxveW1lbnQuXHJcbiAgICAgICAgICAgIGF3YWl0ICQucG9zdCgnJywgJCgnZm9ybScpLnNlcmlhbGl6ZSgpKTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGBVbmFibGUgdG8gc2F2ZSBlbmdpbmUgZGV0YWlsc2ApO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdChlLnJlc3BvbnNlSlNPTik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIldhaXRpbmcgZm9yIGFuIGFnZW50IHRvIGVucXVldWUgdGhlIGRlcGxveW1lbnQuLi5cIik7XHJcblxyXG4gICAgICAgICAgICAvLyB1cmwgZm9yIHRoYXQgcGFydGljdWxhciBkZXBsb3ltZW50XHJcbiAgICAgICAgICAgIGxldCB1cmwgPSBgL2FwaS9lbmdpbmVzLyR7dGhpcy5pZC52YWwoKX0vZGVwbG95YDtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyBtZXRob2Q6ICdQT1NUJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGA8Yj5EZXBsb3ltZW50PC9iPiAke3RoaXMuaWQudmFsKCl9IGNhbiBub3QgYmUgZGVwbG95ZWQuLi5gKTtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvckpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KGVycm9ySnNvbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBkZXBsb3ltZW50c3RhcnQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZShkZXBsb3ltZW50c3RhcnQpXHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihgVW5hYmxlIHRvIGRlcGxveSBlbmdpbmVgKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QoZS5yZXNwb25zZUpTT04pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3llZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25VbmxvYWQoKSB7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub2ZmKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7XHJcbiAgICBtb2RhbFBhbmVsVXNlcnMsXHJcbiAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLFxyXG4gICAgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAsXHJcbiAgICBtb2RhbFBhbmVsRGF0YWJyaWNrcyxcclxuICAgIG1vZGFsUGFuZWxEYXRhRmFjdG9yeVxyXG59IGZyb20gXCIuLi9tb2RhbC9pbmRleC5qc1wiO1xyXG5cclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBhZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRNZW1iZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0TWVtYmVyc1wiKTtcclxuXHJcbiAgICAgICAgbW9kYWxQYW5lbERlbGV0ZUVuZ2luZS5pbml0aWFsaXplKFwicGFuZWxEZWxldGVFbmdpbmVcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuaW5pdGlhbGl6ZShcInBhbmVsUmVzb3VyY2VHcm91cFwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsRGF0YWJyaWNrcy5pbml0aWFsaXplKFwicGFuZWxEYXRhYnJpY2tzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhRmFjdG9yeS5pbml0aWFsaXplKFwicGFuZWxEYXRhRmFjdG9yeVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9ICQoXCIjSWRcIik7XHJcblxyXG4gICAgICAgIGlmICgkKFwiI2NvbnNvbGVcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIgPSBuZXcgY29uc29sZTIoJChcIiNjb25zb2xlXCIpLCAkKCdkaXYuZG9ja2luZy1mb3JtJykpO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RhcnRlZCwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuY29ubmVjdGlvbi5pbnZva2UoJ1N1YnNjcmliZURlcGxveW1lbnRBc3luYycsIHRoaXMuaWQudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZXBsb3llZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIG9uVW5sb2FkKCkge1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9mZihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7v1xuXG5leHBvcnQgY2xhc3MgbWd0bG9hZGVyIHtcblxyXG5cbiAgICBzdGF0aWMgc2V0TWd0UHJvdmlkZXIoKSB7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IG1ndC5Qcm94eVByb3ZpZGVyKFwiL2FwaS9Qcm94eVwiKTtcbiAgICAgICAgcHJvdmlkZXIubG9naW4gPSAoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvQWNjb3VudC9TaWduSW4/cmVkaXJlY3RVcmk9JyArIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBwcm92aWRlci5sb2dvdXQgPSAoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvTWljcm9zb2Z0SWRlbnRpdHkvQWNjb3VudC9TaWduT3V0JztcblxuICAgICAgICBtZ3QuUHJvdmlkZXJzLmdsb2JhbFByb3ZpZGVyID0gcHJvdmlkZXI7XG4gICAgfVxuXG4gICAgc3RhdGljIGludGVyY2VwdE1ndExvZ2luKCkge1xuICAgICAgICB2YXIgbWd0bG9naW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWd0bG9naW4nKTtcblxuICAgICAgICAvLy8vIFRoZXNlcyBldmVudHMgYXJlIHJhaXNlZCB3aGVuIHVzZXIgY2xpY2sgb24gbG9naW4gb3VyIGxvZ291dCBidXR0b25cbiAgICAgICAgLy8vLyBUaGV5ciBhcmUgbm90IHJhaXNlZCBhdCB0aGUgZ29vZCB0aW1pbmdcbiAgICAgICAgLy8vLyBTaG91bGQgYmUgcmVuYW1lZCAnbG9naW5DbGljaycgYW5kICdsb2dvdXRDbGljaydcbiAgICAgICAgLy9tZ3Rsb2dpbi5hZGRFdmVudExpc3RlbmVyKCdsb2dpbkNvbXBsZXRlZCcsICgpID0+IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidXNlcmRldGFpbHNcIikpO1xuICAgICAgICAvL21ndGxvZ2luLmFkZEV2ZW50TGlzdGVuZXIoJ2xvZ291dENvbXBsZXRlZCcsICgpID0+IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwidXNlcmRldGFpbHNcIikpO1xuXG4gICAgICAgIC8vLy8gZ2V0IGxvY2FsIHN0b3JhZ2UgaXRlbSBpZiBhbnlcbiAgICAgICAgLy92YXIgdXNlckRldGFpbHNGcm9tU3RvcmFnZVN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyZGV0YWlscycpO1xuXG4gICAgICAgIC8vaWYgKHVzZXJEZXRhaWxzRnJvbVN0b3JhZ2VTdHJpbmcgIT09IG51bGwgJiYgbWd0bG9naW4udXNlckRldGFpbHMgPT09IG51bGwpXG4gICAgICAgIC8vICAgIG1ndGxvZ2luLnVzZXJEZXRhaWxzID0gSlNPTi5wYXJzZSh1c2VyRGV0YWlsc0Zyb21TdG9yYWdlU3RyaW5nKTtcblxuICAgICAgICAvLy8vIExvYWRpbmcgY29tcGxldGVkIGlzIGNvcnJlY3RseSBmaXJlZCBBRlRFUiBjb21wb25lbnQgaXMgbG9hZGVkIEFORCB1c2VyIGxvZ2dlZCBpblxuICAgICAgICAvL21ndGxvZ2luLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRpbmdDb21wbGV0ZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vICAgIGlmIChtZ3Rsb2dpbi51c2VyRGV0YWlscyAhPT0gbnVsbClcbiAgICAgICAgLy8gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyZGV0YWlscycsIEpTT04uc3RyaW5naWZ5KG1ndGxvZ2luLnVzZXJEZXRhaWxzKSk7XG4gICAgICAgIC8vfSk7XG5cbiAgICB9XG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IGhhbmRsZXJzIH0gZnJvbSBcIi4vaGFuZGxlcnMuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGF1dGgge1xyXG5cclxuXHJcblx0Ly8gc2luZ2xldG9uXHJcblx0c3RhdGljIF9jdXJyZW50O1xyXG5cclxuXHQvKiogQHJldHVybnMge2F1dGh9ICovXHJcblx0c3RhdGljIGdldCBjdXJyZW50KCkge1xyXG5cdFx0aWYgKCFhdXRoLl9jdXJyZW50KVxyXG5cdFx0XHRhdXRoLl9jdXJyZW50ID0gbmV3IGF1dGgoKTtcclxuXHJcblx0XHRyZXR1cm4gYXV0aC5fY3VycmVudDtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBPbkF1dGhlbnRpY2F0ZWQgPSBcIk9uQXV0aGVudGljYXRlZFwiXHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5oYW5kbGVycyA9IG5ldyBoYW5kbGVycygpO1xyXG5cclxuXHRcdC8qKiBAdHlwZSBib29sZWFuICovXHJcblx0XHR0aGlzLmlzQXV0aGVudGljYXRlZCA9IGdsb2JhbFVzZXJBdXRoZW50aWNhdGVkO1xyXG5cdH1cclxuXHJcblx0aW5pdGlhbGl6ZSgpIHtcclxuXHJcblx0XHQkKCgpID0+IHtcclxuXHRcdFx0Ly8gaW52b2tlIGFsbCBoYW5kbGVycyB0byBPbkF1dGhlbnRpY2F0ZWQgd2l0aCB0aGUgY29ycmVjdCB2YWx1ZVxyXG5cdFx0XHR0aGlzLmhhbmRsZXJzLmludm9rZShhdXRoLk9uQXV0aGVudGljYXRlZCwgdGhpcy5pc0F1dGhlbnRpY2F0ZWQsICdjb29sJylcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b24obWV0aG9kTmFtZSwgbmV3TWV0aG9kKSB7XHJcblx0XHR0aGlzLmhhbmRsZXJzLm9uKG1ldGhvZE5hbWUsIG5ld01ldGhvZCk7XHJcblx0fVxyXG5cclxuXHRvZmYobWV0aG9kTmFtZSwgbWV0aG9kKSB7XHJcblx0XHR0aGlzLmhhbmRsZXJzLm9mZihtZXRob2ROYW1lLCBtZXRob2QpO1xyXG5cdH1cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuLi9tb2RhbC9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIjtcclxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCIuLi9hdXRoLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBob21lUGFnZSB7XHJcblxyXG4gICAgLy8gc2luZ2xldG9uXHJcbiAgICBzdGF0aWMgX2N1cnJlbnQ7XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtob21lUGFnZX0gKi9cclxuICAgIHN0YXRpYyBnZXQgY3VycmVudCgpIHtcclxuICAgICAgICBpZiAoIWhvbWVQYWdlLl9jdXJyZW50KVxyXG4gICAgICAgICAgICBob21lUGFnZS5fY3VycmVudCA9IG5ldyBob21lUGFnZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gaG9tZVBhZ2UuX2N1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgJChhc3luYyAoKSA9PiBhd2FpdCB0aGlzLm9uTG9hZCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgbm90aWZpY2F0aW9uIG1vZGFsXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsID0gbmV3IG1vZGFsUGFuZWwoXCJub3RpZlwiKS5zbSgpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIC8vIGF1dG8gYmluZCB3aXRoIGFycm93IGZ1bmN0aW9uXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIC8vIG1hbnVhbCBiaW5kaW5nIGZvciBmdW5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwub25TaG93KHRoaXMuc2hvd1BhbmVsLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwgPSBuZXcgbW9kYWxQYW5lbChcInNldHRpbmdzXCIpLmxnKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLm9uU2hvd24oZSA9PiB0aGlzLnNob3duU2V0dGluZ3NQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRTZXR0aW5nc1BhbmVsKGUpKTtcclxuXHJcblxyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RhcnRlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBzdGFydGVkLlwiKSk7XHJcbiAgICAgICAgLy9ub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCBjb25zb2xlLmxvZyhcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RpbmcuLi5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkLCBhc3luYyAoKSA9PiBhd2FpdCBjb25zb2xlLmxvZyhcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RlZC4uLlwiKSk7XHJcbiAgICAgICAgLy9ub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdG9wcGVkLCBhc3luYyAoKSA9PiBhd2FpdCBjb25zb2xlLmxvZyhcIkJhY2tlbmQgc2VydmVyIHN0b3BwZWQuXCIpKTtcclxuXHJcbiAgICAgICAgLy8gd2hlbiByZWNlaXZpbmcgYW4gb3JkZXIgdG8gcmVmcmVzaCBub3RpZmljYXRpb25zXHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oJ3JlZnJlc2hfbm90aWZpY2F0aW9ucycsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWxsIHRvIHJlZnJlc2hfbm90aWZpY2F0aW9uc1wiKTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoTm90aWZpY2F0aW9uc0FzeW5jKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50LnN0YXJ0KCk7XHJcblxyXG5cclxuICAgICAgICBpZiAoYXV0aC5jdXJyZW50LmlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwuYm9keSgpLmFwcGVuZChgXHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJzZXR0aW5nc1wiPlxyXG4gICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10aC1sYXJnZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWJvdXQgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+U29tZXRoaW5nIGludGVyZXN0aW5nIGxpa2UuLi4gSGV5LCB0aGlzIGlzIGEgcGllY2Ugb2YgT1NTIHByb2plY3QsIG1hZGUgYnkgU2ViYXN0aWVuIFBlcnR1czwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jb2dzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEZWZhdWx0IEVuZ2luZSAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+ICBcclxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwibXQtMlwiIGRhdGEtc3R5bGU9XCJidG4tb3V0bGluZS1kYXJrXCIgZGF0YS1jb250YWluZXI9XCJib2R5XCIgZGF0YS1saXZlLXNlYXJjaD1cInRydWVcIiB0aXRsZT1cIkNob29zZSBkZWZhdWx0IGVuZ2luZVwiIGlkPVwiZGVmYXVsdEVuZ2luZVNlbGVjdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk11c3RhcmQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5LZXRjaHVwPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+UmVsaXNoPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICBgKTtcclxuXHJcbiAgICAgICAgICAgICQoJyNkZWZhdWx0RW5naW5lU2VsZWN0Jykuc2VsZWN0cGlja2VyKCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gXHJcblxyXG4gICAgICAgIGF1dGguY3VycmVudC5vbihhdXRoLk9uQXV0aGVudGljYXRlZCwgYXN5bmMgaXNBdXRoID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzQXV0aClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBkaXNtaXNzTm90aWZpY2F0aW9uc0FzeW5jKCkge1xyXG5cclxuICAgICAgICAvLyBsb2FkaW5nIG5vdGlmaWNhdGlvbnNcclxuICAgICAgICBsZXQgdXJsID0gXCIvYXBpL25vdGlmaWNhdGlvbnNcIjtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbWV0aG9kOiBcIkRFTEVURVwiIH0pO1xyXG5cclxuICAgICAgICB2YXIgZGVsZXRlZCA9IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCFkZWxldGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoTm90aWZpY2F0aW9uc0FzeW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpIHtcclxuXHJcbiAgICAgICAgLy8gbG9hZGluZyBub3RpZmljYXRpb25zXHJcbiAgICAgICAgbGV0IHVybCA9IFwiL2FwaS9ub3RpZmljYXRpb25zXCI7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGxldCBiZWxsQ29udGVudCA9ICQoJyNub3RpZi1iZWxsLWNvbnRlbnQnKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm5vdGlmaWNhdGlvbnMgfHwgdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA8PSAwKSB7XHJcblxyXG4gICAgICAgICAgICBiZWxsQ29udGVudC5oaWRlKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtYmVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eS1tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5ObyBuZXcgbm90aWZpY2F0aW9ucywgeWV0Ljwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBiZWxsQ29udGVudC5zaG93KCk7XHJcbiAgICAgICAgICAgIGJlbGxDb250ZW50LnRleHQodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IG5vdGlmIG9mIHRoaXMubm90aWZpY2F0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBub3RpZlVybCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vdGlmLnVybClcclxuICAgICAgICAgICAgICAgICAgICBub3RpZlVybCA9IGA8YSBocmVmPVwiJHtub3RpZi51cmx9XCIgY2xhc3M9XCJtbC0yIGhpZGUtc21cIj48aSBjbGFzcz1cImZhcyBmYS1leHRlcm5hbC1saW5rLWFsdFwiPjwvaT48L2E+YDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmFwcGVuZChgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi10aXRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2stY2lyY2xlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtub3RpZi50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHtub3RpZi5tZXNzYWdlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7bm90aWZVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2ID5cclxuICAgICAgICAgICAgICAgICAgICA8L2RpdiA+IGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB2YXIgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcbiAgICAgICAgdmFyIHR5cGUgPSBidXR0b24uZGF0YSgndHlwZScpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3duU2V0dGluZ3NQYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRTZXR0aW5nc1BhbmVsKGV2ZW50KSB7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuZGVsZXRlQnV0dG9uVGV4dChcIkRpc21pc3Mgbm90aWZpY2F0aW9uc1wiKTtcclxuXHJcbiAgICAgICAgaWYgKCFhdXRoLmN1cnJlbnQuaXNBdXRoZW50aWNhdGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuYXBwZW5kKGBcclxuICAgICAgICAgICAgICAgICAgICA8IGRpdiBjbGFzcz0gXCJub3RpZi1lbXB0eVwiID5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhciBmYS1iZWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZi1lbXB0eS1tZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlBsZWFzZSBsb2cgaW4gdG8gc2VlIG5vdGlmaWNhdGlvbnMgaGVyZS48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXYgPiBgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5kZWxldGVCdXR0b24oKS5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRpc21pc3NOb3RpZmljYXRpb25zQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmV4cG9ydCBjbGFzcyBzZXR0aW5nc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG4iLCLvu79leHBvcnQgZnVuY3Rpb24gc2V0RW5naW5lQm9vdHN0cmFwVGFibGUoJGVuZ2luZXNUYWJsZSwgdXJsLCBjaGVja2VkLCBvblBvc3RCb2R5LCBvbkNoZWNrUm93KSB7XHJcblxyXG5cclxuICAgIGxldCBvbkNoZWNrID0gY2hlY2tlZCA/IG9uQ2hlY2tSb3cgOiAoKSA9PiB7IH07XHJcbiAgICBsZXQgb25DbGljayA9IGNoZWNrZWQgPyAoKSA9PiB7IH06IG9uQ2hlY2tSb3c7XHJcblxyXG4gICAgbGV0IGNvbHVtbnMgPSBbXTtcclxuICAgIGlmIChjaGVja2VkKVxyXG4gICAgICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgICAgIGZpZWxkOiAnZW5naW5lSWQnLFxyXG4gICAgICAgICAgICByYWRpbzogdHJ1ZSxcclxuICAgICAgICB9KVxyXG5cclxuICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgZmllbGQ6ICdlbmdpbmVUeXBlSnNvbicsXHJcbiAgICAgICAgdGl0bGU6ICdUeXBlJyxcclxuICAgICAgICB3aWR0aDogJzgwJyxcclxuICAgICAgICBhbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgc2VhcmNoRm9ybWF0dGVyOiBmYWxzZSxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz0nc3ZnLTIyeDIyLWljb24nPjxkaXYgY2xhc3M9J3N2Zy1pY29uICR7dmFsdWUuZW5naW5lVHlwZUljb25TdHJpbmd9Jz48L2Rpdj48L2Rpdj5gO1xyXG4gICAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAgICBmaWVsZDogJ3N0YXR1c0pzb24nLFxyXG4gICAgICAgIHRpdGxlOiAnU3RhdHVzJyxcclxuICAgICAgICB3aWR0aDogJzgwJyxcclxuICAgICAgICBhbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgc2VhcmNoRm9ybWF0dGVyOiBmYWxzZSxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPGkgY2xhc3M9XCIke3ZhbHVlLnN0YXR1c0ljb259XCIgdGl0bGU9JyR7dmFsdWUuc3RhdHVzU3RyaW5nfScgc3R5bGU9XCJjb2xvcjoke3ZhbHVlLnN0YXR1c0NvbG9yfTt3aWR0aDoyMHB4O1wiPjwvaT5gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCB7XHJcbiAgICAgICAgZmllbGQ6ICdlbmdpbmVOYW1lJyxcclxuICAgICAgICB0aXRsZTogJ05hbWUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCByb3cpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGA8c3Ryb25nPiR7dmFsdWV9PC9zdHJvbmc+YDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICBzZWFyY2g6IGZhbHNlLFxyXG4gICAgICAgIHNob3dSZWZyZXNoOiBmYWxzZSxcclxuICAgICAgICBzaG93VG9nZ2xlOiBmYWxzZSxcclxuICAgICAgICBjaGVja2JveEhlYWRlcjogZmFsc2UsXHJcbiAgICAgICAgY2xpY2tUb1NlbGVjdDogdHJ1ZSxcclxuICAgICAgICBwYWdpbmF0aW9uOiBmYWxzZSxcclxuICAgICAgICByZXNpemFibGU6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZ1RlbXBsYXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAnPGkgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXNwaW4gZmEtZncgZmEtMnhcIj48L2k+JztcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXHJcbiAgICAgICAgb25Qb3N0Qm9keTogb25Qb3N0Qm9keSxcclxuICAgICAgICBvbkNoZWNrOiBvbkNoZWNrLFxyXG4gICAgICAgIG9uQ2xpY2tSb3c6IG9uQ2xpY2ssXHJcbiAgICAgICAgZm9ybWF0Tm9NYXRjaGVzOiAoKSA9PiB7IHJldHVybiBcIllvdSBkb24ndCBoYXZlIGFueSBydW5uaW5nIGVuZ2luZS4gUGxlYXNlIDxhIGhyZWY9Jy9FbmdpbmVzL0luZGV4Jz5jaGVjayB5b3VyIGVuZ2luZXMgc3RhdHVzLjwvYT4gXCI7IH1cclxuICAgIH0pO1xyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSB9IGZyb20gXCIuLi9ib290c3RyYXBUYWJsZXMvaW5kZXguanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlc1BhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIGdldCB0YWJsZVxyXG4gICAgICAgIHRoaXMuZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBlbmdpbmUgdGFibGVcclxuICAgICAgICB0aGlzLiRlbmdpbmVzVGFibGUgPSAkKFwiI2VuZ2luZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUodGhpcy4kZW5naW5lc1RhYmxlLCBcIi9kYXRhU291cmNlcy9pbmRleC9lbmdpbmVzXCIsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLm9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3cpID0+IHRoaXMub25DbGlja1Jvdyhyb3cpKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlID0gJChcIiNkYXRhU291cmNlc1RhYmxlXCIpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gJ1BsZWFzZSBzZWxlY3QgYSBydW5uaW5nIGVuZ2luZSB0byBzZWUgYWxsIGRhdGEgc291cmNlcyBhdmFpbGFibGUuJzsgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUub24oJ2NsaWNrLXJvdy5icy50YWJsZScsIChyb3csICRlbGVtZW50LCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvRGF0YVNvdXJjZXMvRWRpdC8ke3RoaXMuZW5naW5lLmlkfS8keyRlbGVtZW50Lm5hbWV9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblBvc3RCb2R5KGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsaWNrUm93KHJvdykge1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZSA9IHJvdztcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWREYXRhU291cmNlc0FzeW5jKHRoaXMuZW5naW5lKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgbG9hZERhdGFTb3VyY2VzQXN5bmMoZW5naW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnc2hvd0xvYWRpbmcnKTtcclxuICAgICAgICBsZXQgZGF0YV91cmwgPSBgL2RhdGFTb3VyY2VzL2luZGV4L2RhdGFTb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lLmlkfWA7XHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChkYXRhX3VybCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlcyA9IGF3YWl0IGRhdGFTb3VyY2VzUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZGF0YVNvdXJjZXMpXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCd1cGRhdGVGb3JtYXRUZXh0JywgJ2Zvcm1hdE5vTWF0Y2hlcycsXHJcbiAgICAgICAgICAgIGBObyBkYXRhIHNvdXJjZXMgZm9yIGVuZ2luZSA8c3Ryb25nPiR7ZW5naW5lLmVuZ2luZU5hbWV9PC9zdHJvbmc+LiA8YSBocmVmPScvZGF0YVNvdXJjZXMvbmV3Jz5DcmVhdGUgYSBuZXcgZGF0YSBzb3VyY2U8L2E+IGZvciB5b3VyIGVuZ2luZWApO1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2xvYWQnLCB0aGlzLmRhdGFTb3VyY2VzKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdoaWRlTG9hZGluZycpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3Mgd2l6YXJkUGFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaHRtbEZpZWxkUHJlZml4LCBlbmdpbmVVcmwpIHtcclxuXHJcbiAgICAgICAgLy8gSHRtbEZpZWxkUHJlZml4IHByZWZpeCBpcyB0aGUgcHJlZGl4IGZvciByZW5kZXJpbmcgYXNwLm5ldCBjb3JlIGl0ZW1zXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBgJHtodG1sRmllbGRQcmVmaXh9X2A7XHJcblxyXG4gICAgICAgIC8vIHVybCBmb3IgbG9hZGluZyBlbmdpbmVzXHJcbiAgICAgICAgdGhpcy5lbmdpbmVVcmwgPSBlbmdpbmVVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGdldCBmb3JtXHJcbiAgICAgICAgdGhpcy4kZm9ybSA9ICQoXCJmb3JtXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgZW5naW5lIHRhYmxlXHJcbiAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBzcGlubmVyXHJcbiAgICAgICAgdGhpcy4kc3Bpbm5lciA9ICQoXCIjc3Bpbm5lclwiKVxyXG5cclxuICAgICAgICAvLyBnZXQgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMuJG5leHRCdXR0b24gPSAkKFwiI25leHRCdXR0b25cIik7XHJcbiAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24gPSAkKFwiI3ByZXZpb3VzQnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuJHNhdmVCdXR0b24gPSAkKFwiI3NhdmVCdXR0b25cIik7XHJcblxyXG4gICAgICAgIC8vIGdldCB3aXphcmRcclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZCA9ICQoXCIjc21hcnRXaXphcmRcIik7XHJcblxyXG4gICAgICAgIC8vIGdldCBwcm9wZXJ0aWVzIHBhbmVsXHJcbiAgICAgICAgdGhpcy4kcHJvcGVydGllcyA9ICQoXCIjcHJvcGVydGllc1wiKTtcclxuXHJcbiAgICAgICAgLy8gaGlkZGVuIGZpZWxkc1xyXG4gICAgICAgIHRoaXMuJGVuZ2luZUlkRWxlbWVudCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fUVuZ2luZUlkYCk7XHJcbiAgICAgICAgdGhpcy4kaXNOZXcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1Jc05ld2ApO1xyXG5cclxuICAgICAgICAvLyBObyBwcmVmaXggZm9yIGhpZGRlbnQgU3RlcCBmaWVsZCwgc2luY2UgaXQncyBkaXJlY3RseSBiaW5kZWQgaW50byB0aGUgUGFnZU1vZGVsXHJcbiAgICAgICAgdGhpcy4kc3RlcCA9ICQoYCNTdGVwYCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RlcCA9IHRoaXMuJHN0ZXAgICYmIHRoaXMuJHN0ZXAudmFsKCkgPyBwYXJzZUludCh0aGlzLiRzdGVwLnZhbCgpKSA6IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRzcGlubmVyKVxyXG4gICAgICAgICAgICB0aGlzLiRzcGlubmVyLmhpZGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib29zdHJhcEVuZ2luZXNUYWJsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmJvb3RzdHJhcFdpemFyZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmJvb3RzdHJhcEJ1dHRvbnMoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYm9vdHN0cmFwV2l6YXJkKCkge1xyXG5cclxuICAgICAgICAvLyBTdGVwIHNob3cgZXZlbnRcclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInNob3dTdGVwXCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24sIHN0ZXBQb3NpdGlvbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIHN0ZXBcclxuICAgICAgICAgICAgdGhpcy4kc3RlcC52YWwoc3RlcE51bWJlcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRuZXh0QnV0dG9uLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy4kc2F2ZUJ1dHRvbi5kaXNhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RlcFBvc2l0aW9uID09PSBcImZpcnN0XCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHByZXZpb3VzQnV0dG9uLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGVwUG9zaXRpb24gPT09IFwibWlkZGxlXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHByZXZpb3VzQnV0dG9uLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGVwUG9zaXRpb24gPT09IFwibGFzdFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRuZXh0QnV0dG9uLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNhdmVCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyBib290c3RyYXAgd2l6YXJkXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoe1xyXG4gICAgICAgICAgICBzZWxlY3RlZDogdGhpcy5zdGVwLFxyXG4gICAgICAgICAgICB0aGVtZTogJ2RvdHMnLCAvLyB0aGVtZSBmb3IgdGhlIHdpemFyZCwgcmVsYXRlZCBjc3MgbmVlZCB0byBpbmNsdWRlIGZvciBvdGhlciB0aGFuIGRlZmF1bHQgdGhlbWVcclxuICAgICAgICAgICAgYXV0b0FkanVzdEhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogJ2ZhZGUnLCAvLyBFZmZlY3Qgb24gbmF2aWdhdGlvbiwgbm9uZS9mYWRlL3NsaWRlLWhvcml6b250YWwvc2xpZGUtdmVydGljYWwvc2xpZGUtc3dpbmdcclxuICAgICAgICAgICAgICAgIHNwZWVkOiAnMjAwJywgLy8gVHJhbnNpb24gYW5pbWF0aW9uIHNwZWVkXHJcbiAgICAgICAgICAgICAgICBlYXNpbmc6ICcnIC8vIFRyYW5zaXRpb24gYW5pbWF0aW9uIGVhc2luZy4gTm90IHN1cHBvcnRlZCB3aXRob3V0IGEgalF1ZXJ5IGVhc2luZyBwbHVnaW5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW5hYmxlVVJMaGFzaDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRvb2xiYXJTZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgdG9vbGJhclBvc2l0aW9uOiAnbm9uZScsIC8vIG5vbmUsIHRvcCwgYm90dG9tLCBib3RoXHJcbiAgICAgICAgICAgICAgICB0b29sYmFyQnV0dG9uUG9zaXRpb246ICdyaWdodCcsIC8vIGxlZnQsIHJpZ2h0LCBjZW50ZXJcclxuICAgICAgICAgICAgICAgIHNob3dOZXh0QnV0dG9uOiBmYWxzZSwgLy8gc2hvdy9oaWRlIGEgTmV4dCBidXR0b25cclxuICAgICAgICAgICAgICAgIHNob3dQcmV2aW91c0J1dHRvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBhIFByZXZpb3VzIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckV4dHJhQnV0dG9uczogW10gLy8gRXh0cmEgYnV0dG9ucyB0byBzaG93IG9uIHRvb2xiYXIsIGFycmF5IG9mIGpRdWVyeSBpbnB1dC9idXR0b25zIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGtleWJvYXJkU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGtleU5hdmlnYXRpb246IGZhbHNlLCAvLyBFbmFibGUvRGlzYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uKGxlZnQgYW5kIHJpZ2h0IGtleXMgYXJlIHVzZWQgaWYgZW5hYmxlZClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGVuZ2luZVRhYmxlT25DaGVja1Jvdyhyb3csICRlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lSWRFbGVtZW50LnZhbChyb3cuaWQpO1xyXG5cclxuICAgIH1cclxuICAgIGFzeW5jIGVuZ2luZVRhYmxlT25Qb3N0Qm9keShkYXRhKSB7XHJcblxyXG4gICAgICAgIGlmICghZGF0YT8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZGlzYWJsZSgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50ICYmIHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbGVjdGVkSW5kZXggPSBkYXRhLmZpbmRJbmRleChlID0+IGUuaWQgPT09IHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRJbmRleCA+PSAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIHNlbGVjdGVkSW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSByYWRpbyBpbnB1dHMgYnV0dG9ucyB0byBhZGQgYSB2YWxpZGF0aW9uIHJ1bGUgb24gdGhlbVxyXG4gICAgICAgIGxldCAkYnRTZWxlY3RJdGVtID0gJCgnaW5wdXRbbmFtZT1cImJ0U2VsZWN0SXRlbVwiXScpO1xyXG5cclxuICAgICAgICAkYnRTZWxlY3RJdGVtLnJ1bGVzKFwiYWRkXCIsIHtcclxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCJZb3Ugc2hvdWxkIHNlbGVjdCBhbiBlbmdpbmUgYmVmb3JlIGdvaW5nIG5leHQgc3RlcC5cIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBib29zdHJhcEVuZ2luZXNUYWJsZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLiRlbmdpbmVzVGFibGUgfHwgIXRoaXMuZW5naW5lVXJsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKHRoaXMuJGVuZ2luZXNUYWJsZSwgdGhpcy5lbmdpbmVVcmwsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLmVuZ2luZVRhYmxlT25Qb3N0Qm9keShkYXRhKSxcclxuICAgICAgICAgICAgKHJvdywgJGVsZW1lbnQpID0+IHRoaXMuZW5naW5lVGFibGVPbkNoZWNrUm93KHJvdywgJGVsZW1lbnQpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYm9vdHN0cmFwQnV0dG9ucygpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJHByZXZpb3VzQnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJHByZXZpb3VzQnV0dG9uLmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJwcmV2XCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJG5leHRCdXR0b24pIHtcclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudmFsaWRhdGVGb3JtKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwibmV4dFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhbGlkYXRlRm9ybSgpIHtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLiRmb3JtKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IGlzVmFsaWQgPSB0aGlzLiRmb3JtLnZhbGlkKCk7XHJcblxyXG4gICAgICAgIGlmICghaXNWYWxpZClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgdmFsaWRhdG9yID0gdGhpcy4kZm9ybS52YWxpZGF0ZSgpO1xyXG4gICAgICAgIHZhbGlkYXRvci5yZXNldEZvcm0oKTtcclxuXHJcbiAgICAgICAgbGV0IHN1bW1hcnkgPSB0aGlzLiRmb3JtLmZpbmQoXCIudmFsaWRhdGlvbi1zdW1tYXJ5LWVycm9yc1wiKTtcclxuXHJcbiAgICAgICAgaWYgKHN1bW1hcnkpIHtcclxuICAgICAgICAgICAgbGV0IGxpc3QgPSBzdW1tYXJ5LmZpbmQoXCJ1bFwiKTtcclxuICAgICAgICAgICAgaWYgKGxpc3QpXHJcbiAgICAgICAgICAgICAgICBsaXN0LmVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZVNxbCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGVuZ2luZUlkLCBodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUF6dXJlU3FsRGF0YWJhc2VgKTtcclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCLvu79leHBvcnQgY2xhc3MgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGVuZ2luZUlkLCBodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUF6dXJlQmxvYkZTYCk7XHJcblxyXG5cclxuICAgICAgICAvLyBHZXR0aW5nIHRlc3QgYnV0dG9uXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24gPSAkKFwiI2RhdGFTb3VyY2VUZXN0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24ubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVuZ2luZUlkID0gJChcIiNEYXRhU291cmNlVmlld19FbmdpbmVJZFwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZW5naW5lSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24udGVzdEFzeW5jKGAvYXBpL2RhdGFmYWN0b3JpZXMvJHtlbmdpbmVJZH0vdGVzdGApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSIsIu+7v2V4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVDb3Ntb3NEYiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGVuZ2luZUlkLCBodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUNvc21vc0RiYCk7XHJcblxyXG5cclxuICAgICAgICAvLyBHZXR0aW5nIHRlc3QgYnV0dG9uXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24gPSAkKFwiI2RhdGFTb3VyY2VUZXN0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24ubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGVuZ2luZUlkID0gJChcIiNEYXRhU291cmNlVmlld19FbmdpbmVJZFwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZW5naW5lSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24udGVzdEFzeW5jKGAvYXBpL2RhdGFmYWN0b3JpZXMvJHtlbmdpbmVJZH0vdGVzdGApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBsb2FkQXN5bmMoZW5naW5lSWQsIGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9kYXRhU291cmNlcy9uZXcvcHJvcGVydGllcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkdnQ9QXp1cmVCbG9iU3RvcmFnZWApO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgd2l6YXJkUGFnZSB9IGZyb20gJy4uL3dpemFyZC9pbmRleC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZVNxbCB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlU3FsLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMi5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZUNvc21vc0RiIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVDb3Ntb3NEYi5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZS5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgZGF0YVNvdXJjZU5ldyBleHRlbmRzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCdEYXRhU291cmNlVmlldycsICcvZGF0YVNvdXJjZXMvbmV3L2VuZ2luZXMnKVxyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZVNxbCA9IG5ldyBkYXRhU291cmNlQXp1cmVTcWwoKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIgPSBuZXcgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMigpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIgPSBuZXcgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIoKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlID0gbmV3IGRhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlKCk7XHJcbiAgICAgICAgdGhpcy5sYXN0VHlwZVNlbGVjdGVkID0gJyc7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvLyBjYWxsIGJhc2Ugb25Mb2FkIG1ldGhvZFxyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQub24oXCJzdGVwQ29udGVudFwiLCBhc3luYyAoZSwgYW5jaG9yT2JqZWN0LCBzdGVwTnVtYmVyLCBzdGVwRGlyZWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09IDIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGlubmVyPy5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZW5naW5lSWQ/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgc2VsZWN0aW9uIGZyb20gZGF0YSBzb3VyY2VzIHR5cGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKGBpbnB1dFtuYW1lPVwiRGF0YVNvdXJjZVZpZXcuRGF0YVNvdXJjZVR5cGVcIl06Y2hlY2tlZGApLnZhbCgpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPT09IHR5cGUudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9IHR5cGUudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnYXp1cmVzcWxkYXRhYmFzZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZVNxbC5sb2FkQXN5bmMoZW5naW5lSWQsIHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnYXp1cmVzcWxkdycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZVNxbC5sb2FkQXN5bmMoZW5naW5lSWQsIHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnYXp1cmVibG9iZnMnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZWJsb2JzdG9yYWdlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlQmxvYlN0b3JhZ2UubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2Nvc21vc2RiJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kc3Bpbm5lcj8uaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLy9hc3luYyB0ZXN0Q29ubmVjdGlvbkFzeW5jKGV2dCkge1xyXG5cclxuICAgIC8vICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIC8vICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24udGV4dChcIlwiKTtcclxuICAgIC8vICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24ucmVtb3ZlQ2xhc3MoKTtcclxuXHJcbiAgICAvLyAgICB0aGlzLmJ0blRlc3RDb25uZWN0aW9uLmRpc2FibGUoKTtcclxuXHJcbiAgICAvLyAgICAvLyB1cmwgZm9yIHRoYXQgcGFydGljdWxhciBkZXBsb3ltZW50XHJcbiAgICAvLyAgICBsZXQgdXJsID0gYC9hcGkvZGF0YVNvdXJjZXMvc3FsY29ubmVjdGlvbi90ZXN0YDtcclxuXHJcbiAgICAvLyAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuICAgIC8vICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIC8vICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGNvbm5lY3Rpb246IHRoaXMuY29ubmVjdGlvblN0cmluZy52YWwoKSB9KSxcclxuICAgIC8vICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAvLyAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAvLyAgICAgICAgfVxyXG4gICAgLy8gICAgfSk7XHJcblxyXG4gICAgLy8gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgIC8vICAgICAgICB2YXIgZXJyb3JKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAvLyAgICAgICAgYXdhaXQgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi50ZXh0KGVycm9ySnNvbi5lcnJvcilcclxuICAgIC8vICAgIH1cclxuXHJcbiAgICAvLyAgICB2YXIgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgIC8vICAgIGlmIChyZXN1bHQucmVzdWx0KSB7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5hZGRDbGFzcyhcInRleHQtc3VjY2VzcyBtbC0yXCIpO1xyXG4gICAgLy8gICAgICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24uaHRtbChcIjxpIGNsYXNzPSdmYXMgZmEtY2hlY2stY2lyY2xlJz48L2k+ICBDb25uZWN0aW9uIHN1Y2Nlc3NmdWxcIik7XHJcbiAgICAvLyAgICB9XHJcbiAgICAvLyAgICBlbHNlIHtcclxuICAgIC8vICAgICAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLmFkZENsYXNzKFwidGV4dC1kYW5nZXIgbWwtMlwiKTtcclxuICAgIC8vICAgICAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLmh0bWwoXCI8aSBjbGFzcz0nZmFzIGZhLWV4Y2xhbWF0aW9uLWNpcmNsZSc+PC9pPiAgQ2FuJ3QgY29ubmVjdCB0byB0aGUgc291cmNlIHVzaW5nIHRoaXMgY29ubmVjdGlvbiBzdHJpbmdcIik7XHJcbiAgICAvLyAgICB9XHJcblxyXG4gICAgLy8gICAgdGhpcy5idG5UZXN0Q29ubmVjdGlvbi5lbmFibGUoKTtcclxuICAgIC8vfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHdpemFyZFBhZ2UgfSBmcm9tICcuLi93aXphcmQvaW5kZXguanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVTcWwgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZVNxbC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVDb3Ntb3NEYiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VFZGl0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZW5naW5lSWQgPSAkKFwiI0RhdGFTb3VyY2VWaWV3X0VuZ2luZUlkXCIpLnZhbCgpO1xyXG5cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbiA9ICQoXCIjZGF0YVNvdXJjZVRlc3RCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmNsaWNrKGFzeW5jIChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7dGhpcy5lbmdpbmVJZH0vdGVzdGApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJHNvdXJjZUNvZGUgPSAkKFwiI3NvdXJjZUNvZGVcIik7XHJcblxyXG4gICAgICAgIGxldCBqc29uT2JqZWN0U3RyaW5nID0gJChcIiNEYXRhU291cmNlVmlld19Kc29uU3RyaW5nXCIpLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoanNvbk9iamVjdFN0cmluZyAmJiBqc29uT2JqZWN0U3RyaW5nLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG8gPSBKU09OLnBhcnNlKGpzb25PYmplY3RTdHJpbmcpO1xyXG4gICAgICAgICAgICBsZXQganNvblN0cmluZyA9IFByaXNtLmhpZ2hsaWdodChKU09OLnN0cmluZ2lmeShvLCBudWxsLCAyKSwgUHJpc20ubGFuZ3VhZ2VzLmpzb24sICdqc29uJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgJHNvdXJjZUNvZGUgPSAkKFwiI3NvdXJjZUNvZGVcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHNvdXJjZUNvZGUpXHJcbiAgICAgICAgICAgICAgICAkc291cmNlQ29kZS5odG1sKGpzb25TdHJpbmcpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSB9IGZyb20gXCIuLi9ib290c3RyYXBUYWJsZXMvaW5kZXguanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBlbnRpdGllc1BhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvblBvc3RCb2R5KGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5lbmdpbmUgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICB0aGlzLiRlbmdpbmVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2NoZWNrJywgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uQ2xpY2tSb3cocm93KSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSByb3c7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkRW50aXRpZXNBc3luYyh0aGlzLmVuZ2luZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRhYmxlXHJcbiAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZW5naW5lc1RhYmxlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKHRoaXMuJGVuZ2luZXNUYWJsZSwgJy9lbnRpdGllcy9pbmRleC9lbmdpbmVzJywgdHJ1ZSxcclxuICAgICAgICAgICAgKGRhdGEpID0+IHRoaXMub25Qb3N0Qm9keShkYXRhKSxcclxuICAgICAgICAgICAgKHJvdykgPT4gdGhpcy5vbkNsaWNrUm93KHJvdykpO1xyXG5cclxuICAgICAgICB0aGlzLiRlbnRpdGllc1RhYmxlID0gJChcIiNlbnRpdGllc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLiRlbnRpdGllc1RhYmxlLmJvb3RzdHJhcFRhYmxlKHtcclxuICAgICAgICAgICAgZm9ybWF0Tm9NYXRjaGVzOiAoKSA9PiB7IHJldHVybiAnUGxlYXNlIHNlbGVjdCBhIHJ1bm5pbmcgZW5naW5lIHRvIHNlZSBhbGwgdGhlIGVudGl0aWVzLic7IH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5vbignY2xpY2stcm93LmJzLnRhYmxlJywgKHJvdywgJGVsZW1lbnQsIGZpZWxkKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYC9FbnRpdGllcy9EZXRhaWxzLyR7dGhpcy5lbmdpbmUuaWR9LyR7JGVsZW1lbnQubmFtZX1gO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuIFxyXG5cclxuXHJcbiAgICBhc3luYyBsb2FkRW50aXRpZXNBc3luYyhlbmdpbmUpIHtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnc2hvd0xvYWRpbmcnKTtcclxuICAgICAgICBsZXQgZGF0YV91cmwgPSBgL2VudGl0aWVzL2luZGV4L2VudGl0aWVzP2VuZ2luZUlkPSR7ZW5naW5lLmlkfWA7XHJcbiAgICAgICAgbGV0IGVudGl0aWVzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChkYXRhX3VybCk7XHJcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IGF3YWl0IGVudGl0aWVzUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZW50aXRpZXMpXHJcbiAgICAgICAgICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSgndXBkYXRlRm9ybWF0VGV4dCcsICdmb3JtYXROb01hdGNoZXMnLFxyXG4gICAgICAgICAgICBgTm8gZW50aXRpZXMgZm9yIGVuZ2luZSA8c3Ryb25nPiR7ZW5naW5lLmVuZ2luZU5hbWV9PC9zdHJvbmc+LiA8YSBocmVmPScvZW50aXRpZXMvbmV3Jz5DcmVhdGUgYSBuZXcgZW50aXR5PC9hPiBmb3IgeW91ciBlbmdpbmVgKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnbG9hZCcsIHRoaXMuZW50aXRpZXMpO1xyXG5cclxuICAgICAgICB0aGlzLiRlbnRpdGllc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdoaWRlTG9hZGluZycpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwsIG1vZGFsUGFuZWxFcnJvciB9IGZyb20gJy4uL21vZGFsL2luZGV4JztcclxuXHJcbmV4cG9ydCBjbGFzcyBlbnRpdGllc0F6dXJlU3FsIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZ2luZUlkXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRBc3luYyhodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQsIGVuZ2luZUlkKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2VudGl0aWVzL25ldy9lbnRpdGllcz9kdnQ9QXp1cmVTcWxUYWJsZSZlbmdpbmVJZD0ke2VuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICAvLyBnZXQgZXJyb3JzIGxhYmVsc1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcyA9ICQoXCIjbGFiZWxFcnJvckRhdGFTb3VyY2VzXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMgPSAkKFwiI2xhYmVsRXJyb3JUYWJsZXNcIik7XHJcblxyXG4gICAgICAgIC8vIG9uY2UgbG9hZGVkLCBnZXQgdGhlIHNlbGVjdG9yc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWVgKTtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZyA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VzSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICAvLyBvbiBkYXRhIHNvdXJjZXMgY2hhbmdlcywgcmVmcmVzaCB0aGUgdGFibGVzXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuY2hhbmdlKGFzeW5jICgpID0+IHsgYXdhaXQgdGhpcy5yZWZyZXNoVGFibGVzQXN5bmMoZW5naW5lSWQpIH0pO1xyXG5cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZU5hbWVgKTtcclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZXNJdGVtc1N0cmluZ2ApO1xyXG4gICAgICAgIC8vIG9uIHRhYmxlIGNoYW5nZSwgc2V0IHRoZSBjb3JyZWN0IGF0dHJpYnV0ZXMgZm9yIHRoZSBwcmV2aWV3IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5jaGFuZ2UoKCkgPT4geyB0aGlzLnNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCkgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGRlbHRhUGFuZWwgPSAkKGAjZGVsdGFQYW5lbGApO1xyXG5cclxuICAgICAgICB0aGlzLiRtb2RlID0gJChgaW5wdXRbbmFtZT1cIiR7dGhpcy5odG1sRmllbGRQcmVmaXgucmVwbGFjZShcIl9cIiwgXCJcIil9Lk1vZGVcIl06Y2hlY2tlZGApLnZhbCgpO1xyXG4gICAgICAgIHRoaXMuaGlkZU9yU2hvd0RlbHRhUGFuZWwoKTsgICAgXHJcblxyXG4gICAgICAgICQoYGlucHV0W25hbWU9XCIke3RoaXMuaHRtbEZpZWxkUHJlZml4LnJlcGxhY2UoXCJfXCIsIFwiXCIpfS5Nb2RlXCJdYCkuY2hhbmdlKCgpID0+IHt0aGlzLmhpZGVPclNob3dEZWx0YVBhbmVsKCl9KTtcclxuXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCksIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlT3JTaG93RGVsdGFQYW5lbCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy4kbW9kZSA9ICQoYGlucHV0W25hbWU9XCIke3RoaXMuaHRtbEZpZWxkUHJlZml4LnJlcGxhY2UoXCJfXCIsIFwiXCIpfS5Nb2RlXCJdOmNoZWNrZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJG1vZGUgPT09IFwiRGVsdGFcIikge1xyXG4gICAgICAgICAgICB0aGlzLiRkZWx0YVBhbmVsLnNob3coXCJmYXN0XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGRlbHRhUGFuZWwuaGlkZShcImZhc3RcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJMb2FkaW5nIERhdGEgU291cmNlcyAuLi5cIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy5lbXB0eSgpO1xyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXNVcmwgPSBgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZVNxbERhdGFiYXNlYDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gYXdhaXQgZmV0Y2goZGF0YVNvdXJjZXNVcmwpO1xyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50VHlwZSA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEpID8gKGF3YWl0IHIuanNvbigpKS5lcnJvci5tZXNzYWdlIDogYXdhaXQgci50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICBkYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzSnNvbi5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGRhdGFTb3VyY2VzLCAoaSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbSwgdGV4dDogaXRlbSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGFTb3VyY2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBEYXRhIFNvdXJjZXMuLi5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbChkYXRhU291cmNlcy5qb2luKCkpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGF0YVNvdXJjZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YVNvdXJjZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoVGFibGVzQXN5bmMoZW5naW5lSWQpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBEYXRhIFNvdXJjZXMuLi5cIik7XHJcblxyXG4gICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JEYXRhU291cmNlc1wiLCBlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaFRhYmxlc0FzeW5jKGVuZ2luZUlkKSB7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy5lbXB0eSgpO1xyXG5cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGlzYWJsZVBpY2tlcihcImxvYWRpbmcgdGFibGVzIC4uLlwiKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG4gICAgICAgIGxldCB0YWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgdGFibGVzVXJsID0gYC9hcGkvQXp1cmVTcWxEYXRhYmFzZS8ke2VuZ2luZUlkfS8ke2RhdGFTb3VyY2VTZWxlY3RlZH0vdGFibGVzYDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKHRhYmxlc1VybCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy50ZXh0KHRleHQuZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyAhPSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWJsZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFibGVzID0gdGFibGVzSnNvbi5tYXAoaXRlbSA9PiBgJHtpdGVtLnNjaGVtYU5hbWV9LiR7aXRlbS50YWJsZU5hbWV9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHRhYmxlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbSwgdGV4dDogaXRlbSB9KSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRhYmxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIk5vIFRhYmxlcy4uLlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0U3RyaW5nLnZhbCh0YWJsZXMuam9pbigpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHRhYmxlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFibGVTZWxlY3RlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJldmlld0RhdGFBdHRyaWJ1dGVzKGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yRGF0YVNvdXJjZXNcIiwgZSkuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJldmlld0RhdGFBdHRyaWJ1dGVzKGVuZ2luZUlkKSB7XHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGFTb3VyY2VTZWxlY3RlZD8ubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciB0YWJsZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRhYmxlU2VsZWN0ZWQ/Lmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdGFibGVUYWIgPSB0YWJsZVNlbGVjdGVkLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICB2YXIgc2NoZW1hTmFtZSA9IHRhYmxlVGFiWzBdO1xyXG4gICAgICAgIHZhciB0YWJsZU5hbWUgPSB0YWJsZVRhYlsxXTtcclxuXHJcbiAgICAgICAgLy8gYmVmb3JlIHJlZnJlc2hpbmcgY29sdW1ucywgYWRkIGRhdGEgdG8gcHJldmlldyBidXR0b25zXHJcbiAgICAgICAgbGV0ICRwcmV2aWV3RW50aXR5QnV0dG9uID0gJChcIiNwcmV2aWV3RW50aXR5QnV0dG9uXCIpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJlbmdpbmUtaWRcIiwgZW5naW5lSWQpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJkYXRhLXNvdXJjZS1uYW1lXCIsIGRhdGFTb3VyY2VTZWxlY3RlZCk7XHJcbiAgICAgICAgJHByZXZpZXdFbnRpdHlCdXR0b24uZGF0YShcInNjaGVtYS1uYW1lXCIsIHNjaGVtYU5hbWUpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJ0YWJsZS1uYW1lXCIsIHRhYmxlTmFtZSk7XHJcbiAgICAgICAgJHByZXZpZXdFbnRpdHlCdXR0b24uZGF0YShcInRpdGxlXCIsIGBUYWJsZSBwcmV2aWV3IFske3NjaGVtYU5hbWV9XS5bJHt0YWJsZU5hbWV9XWApO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5pbXBvcnQgeyBtb2RhbFBhbmVsRXJyb3IgfSBmcm9tIFwiLi4vbW9kYWwvaW5kZXhcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBlbnRpdGllc0RlbGltaXRlZFRleHQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZ2luZUlkXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRBc3luYyhodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQsIGVuZ2luZUlkKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2VudGl0aWVzL25ldy9lbnRpdGllcz9kdnQ9RGVsaW1pdGVkVGV4dCZlbmdpbmVJZD0ke2VuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2Zvcm0gYWxsIHNlbGVjdCBwaWNrZXIgaW50byBzZWxlY3RwaWNrZXJcclxuICAgICAgICAkKCdzZWxlY3QnKS5zZWxlY3RwaWNrZXIoKTtcclxuXHJcblxyXG4gICAgICAgIC8vIG9uY2UgbG9hZGVkLCBnZXQgdGhlIHNlbGVjdG9yc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWVgKTtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZyA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VzSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0pzb25JdGVtc1N0cmluZ2ApO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcyA9ICQoXCIjbGFiZWxFcnJvckRhdGFTb3VyY2VzXCIpO1xyXG4gICAgICAgIC8vIG9uIGRhdGEgc291cmNlcyBjaGFuZ2VzLCByZWZyZXNoIHRoZSB0YWJsZXNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5jaGFuZ2UoYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLnJlZnJlc2hTdG9yYWdlc1BhdGhzKGVuZ2luZUlkKSB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1GdWxsUGF0aGApO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoID0gJChcIiNsYWJlbEVycm9yRGlyZWN0b3J5UGF0aFwiKTtcclxuXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJMb2FkaW5nIERhdGEgU291cmNlcyAuLi5cIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLmVtcHR5KCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLm1hcERhdGFTb3VyY2VzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIGxldCBkYXRhU291cmNlcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGAvZW50aXRpZXMvbmV3L2RhdGFzb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmRhdGFTb3VyY2VUeXBlPUF6dXJlQmxvYlN0b3JhZ2VgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50VHlwZSA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEpID8gKGF3YWl0IHIuanNvbigpKS5lcnJvci5tZXNzYWdlIDogYXdhaXQgci50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzMSA9IGRhdGFTb3VyY2VzSnNvbi5tYXAoaXRlbSA9PiB7IGxldCBpID0ge307IGkubmFtZSA9IGl0ZW0ubmFtZTsgaS5kYXRhU291cmNlVHlwZSA9IGl0ZW0uZGF0YVNvdXJjZVR5cGU7IHJldHVybiBpOyB9KTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlczEsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLm5hbWUsIHRleHQ6IGl0ZW0ubmFtZSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByID0gYXdhaXQgZmV0Y2goYC9lbnRpdGllcy9uZXcvZGF0YXNvdXJjZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZGF0YVNvdXJjZVR5cGU9QXp1cmVCbG9iRlNgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50VHlwZSA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEpID8gKGF3YWl0IHIuanNvbigpKS5lcnJvci5tZXNzYWdlIDogYXdhaXQgci50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzSnNvbiA9IGF3YWl0IHIuanNvbigpO1xyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXMyID0gZGF0YVNvdXJjZXNKc29uLm1hcChpdGVtID0+IHsgbGV0IGkgPSB7fTsgaS5uYW1lID0gaXRlbS5uYW1lOyBpLmRhdGFTb3VyY2VUeXBlID0gaXRlbS5kYXRhU291cmNlVHlwZTsgcmV0dXJuIGk7IH0pO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGRhdGFTb3VyY2VzMiwgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0ubmFtZSwgdGV4dDogaXRlbS5uYW1lIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBkYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzMS5jb25jYXQoZGF0YVNvdXJjZXMyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIk5vIERhdGEgU291cmNlcy4uLlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcudmFsKGRhdGFTb3VyY2VzLm1hcChkcyA9PiBkcy5uYW1lKS5qb2luKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNKc29uU2VsZWN0U3RyaW5nLnZhbChKU09OLnN0cmluZ2lmeShkYXRhU291cmNlcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhU291cmNlU2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hTdG9yYWdlc1BhdGhzKGVuZ2luZUlkLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBEYXRhIFNvdXJjZXMuLi5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzSnNvblNlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JcIiwgZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBhbGwgcGF0aHMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBKU09OLnBhcnNlKHRoaXMuJGRhdGFTb3VyY2VzSnNvblNlbGVjdFN0cmluZy52YWwoKSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VzLmZpbmQoZSA9PiBlLm5hbWUgPT0gZGF0YVNvdXJjZVNlbGVjdGVkKTtcclxuXHJcbiAgICAgICAgbGV0IGVudGl0eUxvY2F0aW9uVHlwZUVsZW1lbnQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1Mb2NhdGlvblR5cGVgKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGFTb3VyY2UuZGF0YVNvdXJjZVR5cGUgPT09ICdBenVyZUJsb2JTdG9yYWdlJylcclxuICAgICAgICAgICAgZW50aXR5TG9jYXRpb25UeXBlRWxlbWVudC52YWwoJ0F6dXJlQmxvYlN0b3JhZ2VMb2NhdGlvbicpO1xyXG4gICAgICAgIGVsc2UgaWYgKGRhdGFTb3VyY2UuZGF0YVNvdXJjZVR5cGUgPT09ICdBenVyZUJsb2JGUycpXHJcbiAgICAgICAgICAgIGVudGl0eUxvY2F0aW9uVHlwZUVsZW1lbnQudmFsKCdBenVyZUJsb2JGU0xvY2F0aW9uJyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdG9yaWVzID0gW107XHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gYXdhaXQgZmV0Y2goYC9hcGkvc3RvcmFnZXMvJHtlbmdpbmVJZH0vJHtkYXRhU291cmNlLm5hbWV9L2ZpbGVzYCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRpcmVjdG9yeVBhdGgudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rvcmllc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgZGlyZWN0b3JpZXMgPSBkaXJlY3Rvcmllc0pzb24ubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkaXJlY3RvcmllcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbSwgdGV4dDogaXRlbSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRpcmVjdG9yeVBhdGgudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBTdG9yYWdlIGZpbGVzLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yXCIsIGUpLnNob3coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuaW1wb3J0IHsgbW9kYWxQYW5lbEVycm9yIH0gZnJvbSBcIi4uL21vZGFsL2luZGV4XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNQYXJxdWV0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmdpbmVJZFxyXG4gICAgICovXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50LCBlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PVBhcnF1ZXQmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIGFsbCBzZWxlY3QgcGlja2VyIGludG8gc2VsZWN0cGlja2VyXHJcbiAgICAgICAgJCgnc2VsZWN0Jykuc2VsZWN0cGlja2VyKCk7XHJcblxyXG4gICAgICAgIC8vIG9uY2UgbG9hZGVkLCBnZXQgdGhlIHNlbGVjdG9yc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWVgKTtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZyA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VzSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0pzb25JdGVtc1N0cmluZ2ApO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcyA9ICQoXCIjbGFiZWxFcnJvckRhdGFTb3VyY2VzXCIpO1xyXG4gICAgICAgIC8vIG9uIGRhdGEgc291cmNlcyBjaGFuZ2VzLCByZWZyZXNoIHRoZSB0YWJsZXNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5jaGFuZ2UoYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLnJlZnJlc2hTdG9yYWdlc1BhdGhzKGVuZ2luZUlkKSB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1GdWxsUGF0aGApO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoID0gJChcIiNsYWJlbEVycm9yRGlyZWN0b3J5UGF0aFwiKTtcclxuXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJMb2FkaW5nIERhdGEgU291cmNlcyAuLi5cIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLmVtcHR5KCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLm1hcERhdGFTb3VyY2VzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIGxldCBkYXRhU291cmNlcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGAvZW50aXRpZXMvbmV3L2RhdGFzb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmRhdGFTb3VyY2VUeXBlPUF6dXJlQmxvYlN0b3JhZ2VgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50VHlwZSA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEpID8gKGF3YWl0IHIuanNvbigpKS5lcnJvci5tZXNzYWdlIDogYXdhaXQgci50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzMSA9IGRhdGFTb3VyY2VzSnNvbi5tYXAoaXRlbSA9PiB7IGxldCBpID0ge307IGkubmFtZSA9IGl0ZW0ubmFtZTsgaS5kYXRhU291cmNlVHlwZSA9IGl0ZW0uZGF0YVNvdXJjZVR5cGU7IHJldHVybiBpOyB9KTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlczEsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiBpdGVtLm5hbWUsIHRleHQ6IGl0ZW0ubmFtZSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByID0gYXdhaXQgZmV0Y2goYC9lbnRpdGllcy9uZXcvZGF0YXNvdXJjZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZGF0YVNvdXJjZVR5cGU9QXp1cmVCbG9iRlNgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50VHlwZSA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEpID8gKGF3YWl0IHIuanNvbigpKS5lcnJvci5tZXNzYWdlIDogYXdhaXQgci50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzSnNvbiA9IGF3YWl0IHIuanNvbigpO1xyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXMyID0gZGF0YVNvdXJjZXNKc29uLm1hcChpdGVtID0+IHsgbGV0IGkgPSB7fTsgaS5uYW1lID0gaXRlbS5uYW1lOyBpLmRhdGFTb3VyY2VUeXBlID0gaXRlbS5kYXRhU291cmNlVHlwZTsgcmV0dXJuIGk7IH0pO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGRhdGFTb3VyY2VzMiwgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0ubmFtZSwgdGV4dDogaXRlbS5uYW1lIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBkYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzMS5jb25jYXQoZGF0YVNvdXJjZXMyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIk5vIERhdGEgU291cmNlcy4uLlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc0pzb25TZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcudmFsKGRhdGFTb3VyY2VzLm1hcChkcyA9PiBkcy5uYW1lKS5qb2luKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNKc29uU2VsZWN0U3RyaW5nLnZhbChKU09OLnN0cmluZ2lmeShkYXRhU291cmNlcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhU291cmNlU2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hTdG9yYWdlc1BhdGhzKGVuZ2luZUlkLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBEYXRhIFNvdXJjZXMuLi5cIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzSnNvblNlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JcIiwgZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBhbGwgcGF0aHMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBKU09OLnBhcnNlKHRoaXMuJGRhdGFTb3VyY2VzSnNvblNlbGVjdFN0cmluZy52YWwoKSk7XHJcblxyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VzLmZpbmQoZSA9PiBlLm5hbWUgPT0gZGF0YVNvdXJjZVNlbGVjdGVkKTtcclxuXHJcbiAgICAgICAgbGV0IGVudGl0eUxvY2F0aW9uVHlwZUVsZW1lbnQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1Mb2NhdGlvblR5cGVgKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGFTb3VyY2UuZGF0YVNvdXJjZVR5cGUgPT09ICdBenVyZUJsb2JTdG9yYWdlJylcclxuICAgICAgICAgICAgZW50aXR5TG9jYXRpb25UeXBlRWxlbWVudC52YWwoJ0F6dXJlQmxvYlN0b3JhZ2VMb2NhdGlvbicpO1xyXG4gICAgICAgIGVsc2UgaWYgKGRhdGFTb3VyY2UuZGF0YVNvdXJjZVR5cGUgPT09ICdBenVyZUJsb2JGUycpXHJcbiAgICAgICAgICAgIGVudGl0eUxvY2F0aW9uVHlwZUVsZW1lbnQudmFsKCdBenVyZUJsb2JGU0xvY2F0aW9uJyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgbGV0IGRpcmVjdG9yaWVzID0gW107XHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gYXdhaXQgZmV0Y2goYC9hcGkvc3RvcmFnZXMvJHtlbmdpbmVJZH0vJHtkYXRhU291cmNlLm5hbWV9L2ZpbGVzYCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRpcmVjdG9yeVBhdGgudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rvcmllc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgZGlyZWN0b3JpZXMgPSBkaXJlY3Rvcmllc0pzb24ubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkaXJlY3RvcmllcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbSwgdGV4dDogaXRlbSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRpcmVjdG9yeVBhdGgudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBTdG9yYWdlIGZpbGVzLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yXCIsIGUpLnNob3coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsRXJyb3IsIG1vZGFsUGFuZWxQcmV2aWV3IH0gZnJvbSBcIi4uL21vZGFsL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7IGVudGl0aWVzQXp1cmVTcWwgfSBmcm9tIFwiLi9lbnRpdGllc0F6dXJlU3FsLmpzXCI7XHJcbmltcG9ydCB7IGVudGl0aWVzRGVsaW1pdGVkVGV4dCB9IGZyb20gXCIuL2VudGl0aWVzRGVsaW1pdGVkVGV4dC5qc1wiO1xyXG5pbXBvcnQgeyBlbnRpdGllc1BhcnF1ZXQgfSBmcm9tIFwiLi9lbnRpdGllc1BhcnF1ZXQuanNcIjtcclxuaW1wb3J0IHsgd2l6YXJkUGFnZSB9IGZyb20gJy4uL3dpemFyZC9pbmRleC5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNOZXdQYWdlIGV4dGVuZHMgd2l6YXJkUGFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoJ0VudGl0eVZpZXcnLCAnL2VudGl0aWVzL25ldy9lbmdpbmVzJyk7XHJcblxyXG4gICAgICAgIHRoaXMuZW50aXRpZXNBenVyZVNxbCA9IG5ldyBlbnRpdGllc0F6dXJlU3FsKCk7XHJcbiAgICAgICAgdGhpcy5lbnRpdGllc0RlbGltaXRlZFRleHQgPSBuZXcgZW50aXRpZXNEZWxpbWl0ZWRUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5lbnRpdGllc1BhcnF1ZXQgPSBuZXcgZW50aXRpZXNQYXJxdWV0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0VHlwZVNlbGVjdGVkID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBvbkxvYWQgbWV0aG9kXHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcblxyXG4gICAgICAgIC8vIGluaXQgcHJldmlldyBwYW5lbFxyXG4gICAgICAgIG1vZGFsUGFuZWxQcmV2aWV3LmluaXRpYWxpemUoXCJwYW5lbFByZXZpZXdcIik7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBhbGwgc2VsZWN0IHBpY2tlciBpbnRvIHNlbGVjdHBpY2tlclxyXG4gICAgICAgICQoJ3NlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcImxlYXZlU3RlcFwiLCAoZSwgYW5jaG9yT2JqZWN0LCBjdXJyZW50U3RlcEluZGV4LCBuZXh0U3RlcEluZGV4LCBzdGVwRGlyZWN0aW9uKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0ZXBJbmRleCA9PSAxICYmIG5leHRTdGVwSW5kZXggPT0gMikge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJChgaW5wdXRbbmFtZT1cIkVudGl0eVZpZXcuRW50aXR5VHlwZVwiXTpjaGVja2VkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlICE9PSAnQXp1cmVTcWxUYWJsZScgJiYgdHlwZSAhPT0gJ0RlbGltaXRlZFRleHQnICYmIHR5cGUgIT09ICdQYXJxdWV0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoJ2VudGl0eVN0ZXBOb3RFeGlzdCcsICd0aGlzIGVudGl0eSBpcyBub3QgeWV0IGltcGxlbWVudGVkLi4uJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLm9uKFwic3RlcENvbnRlbnRcIiwgYXN5bmMgKGUsIGFuY2hvck9iamVjdCwgc3RlcE51bWJlciwgc3RlcERpcmVjdGlvbikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXBOdW1iZXIgPT0gMikge1xyXG5cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiRlbmdpbmVJZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVuZ2luZUlkID0gdGhpcy4kZW5naW5lSWRFbGVtZW50LnZhbCgpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVuZ2luZUlkPy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJChgaW5wdXRbbmFtZT1cIkVudGl0eVZpZXcuRW50aXR5VHlwZVwiXTpjaGVja2VkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPT09IHR5cGUudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9IHR5cGUudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09ICdBenVyZVNxbFRhYmxlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZW50aXRpZXNBenVyZVNxbC5sb2FkQXN5bmModGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMsIGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ0RlbGltaXRlZFRleHQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbnRpdGllc0RlbGltaXRlZFRleHQubG9hZEFzeW5jKHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzLCBlbmdpbmVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdQYXJxdWV0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZW50aXRpZXNQYXJxdWV0LmxvYWRBc3luYyh0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcywgZW5naW5lSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNEZXRhaWxzUGFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uUG9zdEJvZHkoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZSA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25DbGlja1Jvdyhyb3cpIHtcclxuICAgICAgICB0aGlzLmVuZ2luZSA9IHJvdztcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRFbnRpdGllc0FzeW5jKHRoaXMuZW5naW5lKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBnZXQgdGFibGVcclxuICAgICAgICB0aGlzLiRwaXBlbGluZXNUYWJsZSA9ICQoXCIjcGlwZWxpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kcGlwZWxpbmVzVGFibGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy4kcGlwZWxpbmVzVGFibGUuYm9vdHN0cmFwVGFibGUoKTtcclxuICAgIH1cclxuXHJcbiBcclxuICAgIGFzeW5jIG9uVW5Mb2FkKCkge1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuZXhwb3J0IGNsYXNzIGVudGl0aWVzTmV3VmVyc2lvblBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAkKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikuaW5wdXRTcGlubmVyKCk7XHJcblxyXG4gICAgICAgIC8vIGdldCB3aXphcmRcclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZCA9ICQoXCIjc21hcnRXaXphcmRcIik7XHJcblxyXG5cclxuICAgICAgICAvLyBib290c3RyYXAgd2l6YXJkXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoe1xyXG4gICAgICAgICAgICBzZWxlY3RlZDogMCxcclxuICAgICAgICAgICAgdGhlbWU6ICdkZWZhdWx0JywgLy8gdGhlbWUgZm9yIHRoZSB3aXphcmQsIHJlbGF0ZWQgY3NzIG5lZWQgdG8gaW5jbHVkZSBmb3Igb3RoZXIgdGhhbiBkZWZhdWx0IHRoZW1lXHJcbiAgICAgICAgICAgIGF1dG9BZGp1c3RIZWlnaHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBqdXN0aWZpZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRWZmZWN0IG9uIG5hdmlnYXRpb24sIG5vbmUvZmFkZS9zbGlkZS1ob3Jpem9udGFsL3NsaWRlLXZlcnRpY2FsL3NsaWRlLXN3aW5nXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJzIwMCcsIC8vIFRyYW5zaW9uIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnJyAvLyBUcmFuc2l0aW9uIGFuaW1hdGlvbiBlYXNpbmcuIE5vdCBzdXBwb3J0ZWQgd2l0aG91dCBhIGpRdWVyeSBlYXNpbmcgcGx1Z2luXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuYWJsZVVSTGhhc2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB0b29sYmFyU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJQb3NpdGlvbjogJ25vbmUnLCAvLyBub25lLCB0b3AsIGJvdHRvbSwgYm90aFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvblBvc2l0aW9uOiAncmlnaHQnLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXHJcbiAgICAgICAgICAgICAgICBzaG93TmV4dEJ1dHRvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBhIE5leHQgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBzaG93UHJldmlvdXNCdXR0b246IGZhbHNlLCAvLyBzaG93L2hpZGUgYSBQcmV2aW91cyBidXR0b25cclxuICAgICAgICAgICAgICAgIHRvb2xiYXJFeHRyYUJ1dHRvbnM6IFtdIC8vIEV4dHJhIGJ1dHRvbnMgdG8gc2hvdyBvbiB0b29sYmFyLCBhcnJheSBvZiBqUXVlcnkgaW5wdXQvYnV0dG9ucyBlbGVtZW50c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhbmNob3JTZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgYW5jaG9yQ2xpY2thYmxlOiB0cnVlLCAvLyBFbmFibGUvRGlzYWJsZSBhbmNob3IgbmF2aWdhdGlvblxyXG4gICAgICAgICAgICAgICAgZW5hYmxlQWxsQW5jaG9yczogdHJ1ZSwgLy8gQWN0aXZhdGVzIGFsbCBhbmNob3JzIGNsaWNrYWJsZSBhbGwgdGltZXNcclxuICAgICAgICAgICAgICAgIG1hcmtEb25lU3RlcDogdHJ1ZSwgLy8gQWRkIGRvbmUgc3RhdGUgb24gbmF2aWdhdGlvblxyXG4gICAgICAgICAgICAgICAgbWFya0FsbFByZXZpb3VzU3RlcHNBc0RvbmU6IHRydWUsIC8vIFdoZW4gYSBzdGVwIHNlbGVjdGVkIGJ5IHVybCBoYXNoLCBhbGwgcHJldmlvdXMgc3RlcHMgYXJlIG1hcmtlZCBkb25lXHJcbiAgICAgICAgICAgICAgICByZW1vdmVEb25lU3RlcE9uTmF2aWdhdGVCYWNrOiBmYWxzZSwgLy8gV2hpbGUgbmF2aWdhdGUgYmFjayBkb25lIHN0ZXAgYWZ0ZXIgYWN0aXZlIHN0ZXAgd2lsbCBiZSBjbGVhcmVkXHJcbiAgICAgICAgICAgICAgICBlbmFibGVBbmNob3JPbkRvbmVTdGVwOiB0cnVlIC8vIEVuYWJsZS9EaXNhYmxlIHRoZSBkb25lIHN0ZXBzIG5hdmlnYXRpb25cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAga2V5Ym9hcmRTZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAga2V5TmF2aWdhdGlvbjogZmFsc2UsIC8vIEVuYWJsZS9EaXNhYmxlIGtleWJvYXJkIG5hdmlnYXRpb24obGVmdCBhbmQgcmlnaHQga2V5cyBhcmUgdXNlZCBpZiBlbmFibGVkKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmxldCBqcXVlcnlFeHRlbmRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIGV4dGVuZCBwaWNrZXJcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBkaXNhYmxlUGlja2VyOiBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1wdHkoKTtcclxuICAgICAgICAgICAgdGhpcy5hdHRyKFwiZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIG1zZyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGVuYWJsZVBpY2tlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gZXh0ZW5kIGVuYWJsZSBkaXNhYmxlIG9mIGJ1dHRvbnMgYW5kIGEgaHJlZlxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAvLyBleHRlbmQgbG9hZCBhc3luY1xyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGxvYWRBc3luYzogZnVuY3Rpb24gKGRhdGFfdXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQoZGF0YV91cmwsIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgdGVzdEFzeW5jOiBhc3luYyBmdW5jdGlvbiAodXJsKSB7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBidXR0b24gd2hpY2ggY2xpY2tlZCAhXHJcbiAgICAgICAgICAgIGxldCAkYnRuID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2QtZmxleCBhbGlnbi1pdGVtcy1iYXNlbGluZSB0ZXh0LW5vd3JhcCcpLmFkZENsYXNzKCdkLWZsZXggYWxpZ24taXRlbXMtYmFzZWxpbmUgdGV4dC1ub3dyYXAnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidG5JZCA9ICRidG4uYXR0cignaWQnKTtcclxuICAgICAgICAgICAgbGV0IHNwaW5uZXJJZCA9IGAke2J0bklkfVNwaW5uZXJgO1xyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZUlkID0gYCR7YnRuSWR9TWVzc2FnZWA7XHJcblxyXG4gICAgICAgICAgICBsZXQgJHNwaW5uZXJTcGFuID0gJChgIyR7c3Bpbm5lcklkfWApO1xyXG4gICAgICAgICAgICBsZXQgJG1lc3NhZ2VTcGFuID0gJChgIyR7bWVzc2FnZUlkfWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkc3Bpbm5lclNwYW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgJGJ0bi5hZnRlcihgPHNwYW4gaWQ9JHtzcGlubmVySWR9IHN0eWxlPVwiZGlzcGxheTpub25lO1wiIGNsYXNzPVwibWwtMlwiPjxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT48L3NwYW4+YCk7XHJcblxyXG4gICAgICAgICAgICAkc3Bpbm5lclNwYW4gPSAkKGAjJHtzcGlubmVySWR9YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRtZXNzYWdlU3Bhbi5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lclNwYW4uYWZ0ZXIoYDxzcGFuIGlkPSR7bWVzc2FnZUlkfSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIiBjbGFzcz1cIm1sLTJcIj48L3NwYW4+YCk7XHJcblxyXG4gICAgICAgICAgICAkbWVzc2FnZVNwYW4gPSAkKGAjJHttZXNzYWdlSWR9YCk7XHJcblxyXG4gICAgICAgICAgICAkbWVzc2FnZVNwYW4uaGlkZSgpO1xyXG4gICAgICAgICAgICAkc3Bpbm5lclNwYW4uc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IGF3YWl0ICRidG4ucG9zdEFzeW5jKHVybCwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRzcGlubmVyU3Bhbi5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHIuZXJyb3JzIHx8IHIgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgci5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gT2JqZWN0LnZhbHVlcyhyLmVycm9ycykuZmxhdE1hcChlID0+IGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IFtcIkNhbid0IGNvbm5lY3RcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IGA8aSBjbGFzcz1cImZhcyBmYS1leGNsYW1hdGlvblwiPjwvaT4gJHtlcnJvcnNbMF19YDtcclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uYWRkQ2xhc3MoXCJ0ZXh0LWRhbmdlclwiKS5yZW1vdmVDbGFzcyhcInRleHQtc3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgPSAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+IGNvbm5lY3Rpb24gc3VjY2Vzc2Z1bCc7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmFkZENsYXNzKFwidGV4dC1zdWNjZXNzXCIpLnJlbW92ZUNsYXNzKFwidGV4dC1kYW5nZXJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uc2hvdygpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JFeHRlbnNpb25Qb3N0XCIsIGUpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBwb3N0QXN5bmM6IGFzeW5jIGZ1bmN0aW9uICh1cmwsIGNoZWNrSXNWYWxpZCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkKFwiZm9ybVwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGVja0lzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIExhdW5jaCBhIHZhbGlkYXRpb24gYmVmb3JlXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9ICQoXCJmb3JtXCIpLnZhbGlkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGZvcm1WYWx1ZXMgPSAkKCdmb3JtJykuc2VyaWFsaXplQXJyYXkoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICAkLmVhY2goZm9ybVZhbHVlcywgZnVuY3Rpb24gKGksIHYpIHtcclxuICAgICAgICAgICAgICAgIGZvcm1kYXRhLmFwcGVuZCh2Lm5hbWUsIHYudmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keTogZm9ybWRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDAgfHwgcmVzcG9uc2VKc29uID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tJc1ZhbGlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gJChkb2N1bWVudCkuZmluZChcIltkYXRhLXZhbG1zZy1zdW1tYXJ5PXRydWVdXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGNvbnRhaW5lci5maW5kKFwidWxcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VKc29uICYmIHJlc3BvbnNlSnNvbi5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IE9iamVjdC52YWx1ZXMocmVzcG9uc2VKc29uLmVycm9ycykuZmxhdE1hcChlID0+IGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gW1wiQ2FuJ3QgY29ubmVjdFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QgJiYgbGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhcInZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIikucmVtb3ZlQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktdmFsaWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVycm9ycywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCI8bGkgLz5cIikuaHRtbCh0aGlzKS5hcHBlbmRUbyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZUpzb247XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckV4Y2VwdGlvbjogW2VdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuXHJcbi8vYXN5bmMgcG9zdEFzeW5jKCkge1xyXG4vLyAgICAvLyBGaXJzdCwgc2F2ZSB0aGUgZGVwbG95bWVudC5cclxuXHJcbi8vICAgIGxldCB0b2tlbiA9ICQoJ2lucHV0W25hbWU9XCJfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlblwiXScpLnZhbCgpO1xyXG5cclxuLy8gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJycsIHtcclxuLy8gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4vLyAgICAgICAgYm9keTogYGRhdGFTb3VyY2VWaWV3LkVuZ2luZUlkPSR7dGhpcy5kYXRhU291cmNlVmlldy5lbmdpbmVJZH1gICtcclxuLy8gICAgICAgICAgICBgJmRhdGFTb3VyY2VWaWV3LkRhdGFTb3VyY2VUeXBlPSR7dGhpcy5kYXRhU291cmNlVmlldy5kYXRhU291cmNlVHlwZX1gICtcclxuLy8gICAgICAgICAgICBgJmRhdGFTb3VyY2VWaWV3LkNvbm5lY3Rpb25TdHJpbmc9JHt0aGlzLmRhdGFTb3VyY2VWaWV3LmNvbm5lY3Rpb25TdHJpbmd9YCArXHJcbi8vICAgICAgICAgICAgYCZfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlbj0ke3Rva2VufWAsXHJcbi8vICAgICAgICBoZWFkZXJzOiB7XHJcbi8vICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9dXRmLThcIlxyXG4vLyAgICAgICAgfVxyXG4vLyAgICB9KTtcclxuXHJcbi8vfVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGpxdWVyeUV4dGVuZHMpKCk7Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4vcm91dGVyLmpzXCI7XHJcbmltcG9ydCB7IGRhc2hib2FyZFBhZ2UgfSBmcm9tIFwiLi9kYXNoYm9hcmQvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgZW5naW5lc1BhZ2UsIGVuZ2luZURldGFpbHNQYWdlIH0gZnJvbSBcIi4vZW5naW5lcy9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBhZG1pblBhZ2UsIGFkbWluRGVwbG95bWVudEVuZ2luZVBhZ2UsIGFkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlIH0gZnJvbSBcIi4vYWRtaW4vaW5kZXguanNcIjtcclxuaW1wb3J0IHsgbWd0bG9hZGVyIH0gZnJvbSBcIi4vbWd0LmpzXCI7XHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuL25vdGlmaWNhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBob21lUGFnZSB9IGZyb20gXCIuL2hvbWUvaG9tZVBhZ2UuanNcIjtcclxuaW1wb3J0IHsgc2V0dGluZ3NQYWdlIH0gZnJvbSBcIi4vc2V0dGluZ3Mvc2V0dGluZ3NQYWdlLmpzXCI7XHJcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCJcclxuaW1wb3J0IHsgZG90bWltdGFibGUgfSBmcm9tIFwiLi9kb3RtaW10YWJsZVwiXHJcbmltcG9ydCB7IHBlcnNvbkZvcm1hdHRlcnMgfSBmcm9tICcuL2Zvcm1hdHRlcnMvaW5kZXguanMnXHJcbmltcG9ydCB7IGRhdGFTb3VyY2VOZXcsIGRhdGFTb3VyY2VzUGFnZSwgZGF0YVNvdXJjZUVkaXQgfSBmcm9tICcuL2RhdGFTb3VyY2VzL2luZGV4LmpzJ1xyXG5pbXBvcnQgeyBlbnRpdGllc1BhZ2UsIGVudGl0aWVzTmV3UGFnZSwgZW50aXRpZXNEZXRhaWxzUGFnZSwgZW50aXRpZXNOZXdWZXJzaW9uUGFnZSB9IGZyb20gJy4vZW50aXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBkIGZyb20gJy4vZXh0ZW5zaW9ucy5qcyc7XHJcblxyXG5kb3RtaW10YWJsZS5pbml0aWFsaXplKCk7XHJcblxyXG4vLyBJbml0aWFsaXplIGhvbWUgcGFnZSB0byByZWdpc3RlciBub3RpZmljYXRpb25zXHJcbmhvbWVQYWdlLmN1cnJlbnQuaW5pdGlhbGl6ZSgpO1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBhdXRoIGhlbHBlclxyXG5hdXRoLmN1cnJlbnQuaW5pdGlhbGl6ZSgpO1xyXG5cclxuXHJcbm1ndGxvYWRlci5zZXRNZ3RQcm92aWRlcigpO1xyXG5tZ3Rsb2FkZXIuaW50ZXJjZXB0TWd0TG9naW4oKTtcclxuXHJcbnJvdXRlci5yZWdpc3RlcignL0Rhc2hib2FyZCcsIGRhc2hib2FyZFBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXNoYm9hcmQvSW5kZXgnLCBkYXNoYm9hcmRQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcycsIGVuZ2luZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcy9JbmRleCcsIGVuZ2luZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcy9EZXRhaWxzJywgZW5naW5lRGV0YWlsc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbi9JbmRleCcsIGFkbWluUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluJywgYWRtaW5QYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvU2V0dGluZ3MvSW5kZXgnLCBzZXR0aW5nc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9TZXR0aW5ncycsIHNldHRpbmdzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluL0RldGFpbHMnLCBhZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluL0RlcGxveScsIGFkbWluRGVwbG95bWVudEVuZ2luZVBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcycsIGRhdGFTb3VyY2VzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0RhdGFTb3VyY2VzL05ldycsIGRhdGFTb3VyY2VOZXcpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcy9FZGl0JywgZGF0YVNvdXJjZUVkaXQpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbnRpdGllcycsIGVudGl0aWVzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VudGl0aWVzL05ldycsIGVudGl0aWVzTmV3UGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VudGl0aWVzL0RldGFpbHMnLCBlbnRpdGllc0RldGFpbHNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW50aXRpZXMvVmVyc2lvbicsIGVudGl0aWVzTmV3VmVyc2lvblBhZ2UpO1xyXG4iXSwibmFtZXMiOlsibW9kYWxQYW5lbEVycm9yIiwicm91dGVyIl0sIm1hcHBpbmdzIjoiQUFBQztBQUNEO0FBQ08sTUFBTSxNQUFNLENBQUM7QUFDcEI7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNsQixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM3QixRQUFRLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2hEO0FBQ0EsUUFBUSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xGO0FBQ0EsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxRQUFRLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzdCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGNBQWMsR0FBRztBQUNyQixRQUFRLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNoQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGtCQUFrQixHQUFHO0FBQ3pCLFFBQVEsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7QUFDM0MsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRztBQUNwQixRQUFRLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUMvQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGVBQWUsR0FBRztBQUN0QixRQUFRLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztBQUNqQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxL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USxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUN4RDtBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzdDLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzdDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDM0IsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUM1QixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQztBQUN0QztBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUs7QUFDcEMsWUFBWSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDakMsWUFBWSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFH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