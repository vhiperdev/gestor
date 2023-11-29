export const Forbidden = () => {
    return (
        <div
            style={{
                fontFamily:
                    'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                height: "100vh",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <div style={{ lineHeight: 3 }}>
                <style
                    dangerouslySetInnerHTML={{
                        __html:
                            "body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"
                    }}
                />
                <h1
                    className="next-error-h1"
                    style={{
                        display: "inline-block",
                        margin: "0px 20px 0px 0px",
                        paddingRight: 23,
                        fontSize: 24,
                        fontWeight: 500
                    }}
                >
                    403
                </h1>
                <div style={{ display: "inline-block" }}>
                    <h2 style={{ fontSize: 14, fontWeight: 400, lineHeight: 28 }}>
                        Your Account doesn&apos;t have access.
                    </h2>
                </div>
            </div>
        </div>

    )
}