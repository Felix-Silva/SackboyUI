import PopIt from "./components/PopIt";
import { BUTTONS } from "./constants";

export default function App() {
    return (
        <div style={{ width: "100vw", height: "100vh", background: "#e8d9b0" }}>
            <PopIt
                buttons={BUTTONS}
                color="#f521b9"
                onSelect={(item) => console.log("Selected:", item.label)}
            />
        </div>
    );
}
