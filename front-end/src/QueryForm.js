export function QueryForm(params) {

    const handleChange = (event) => {
        let newQueryObject = { ...params.formObject };
        newQueryObject[event.target.name] = event.target.value;
        params.setFormObject(newQueryObject);
    };

    function onSubmitClick(event) {
        event.preventDefault();
        if (!params.formObject.queryName) {
            alert("please provide a name for the query!");
            return;
        }
        if (!params.formObject.q || params.formObject.q.length === 0) {
            alert("please provide some text for the query field!");
            return;
        }
        params.submitToParent(params.formObject);
    };

    function currentUserIsAdmin() {
        if (params.currentUser) {
            if (params.currentUser.user) {
                if (params.currentUser.user === "admin") {
                    return true;
                }
            }
        }
        return false;
    }

    return (
        <div>
            <form>
                <div>
                    <label htmlFor="queryName">Query Name: </label>
                    <input
                        type="text"
                        size={10}
                        id="queryName"
                        name="queryName"
                        value={params.formObject.queryName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="q">Query Text: </label>
                    <input
                        type="text"
                        size={10}
                        id="q"
                        name="q"
                        value={params.formObject.q}
                        onChange={handleChange}
                    />
                </div>
                <div className={currentUserIsAdmin() ? "visible" : "hidden"}
                    style={{ border: "solid black 1px" }}>
                    {/* Extra fields for admin */}
                    <label>
                        Language:
                        <input
                            type="text"
                            value={params.formObject.language || ''}
                            onChange={e => params.setFormObject(f => ({ ...f, language: e.target.value }))}
                        />
                    </label>
                    <label>
                        Page Size:
                        <input
                            type="number"
                            value={params.formObject.pageSize || ''}
                            onChange={e => params.setFormObject(f => ({ ...f, pageSize: e.target.value }))}
                        />
                    </label>
                </div>
                <span style={{ display: "block", backgroundColor: "#eee" }}>
                    <input type="button" value="Submit" onClick={onSubmitClick} />
                </span>
            </form>
        </div>
    );



}