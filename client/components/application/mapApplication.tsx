import * as React from "react";
import { Link } from "react-router-dom";

import "./application.css";

export function MapApplication() {
  return (
    <>
      <header>
        <h1>Kristiania mapping</h1>
      </header>
      <nav>
        <Link to={"/"}>Menu Item 1</Link>
        <Link to={"/"}>Menu Item 2</Link>
        <Link to={"/"}>Menu Item 3</Link>
        <Link to={"/"}>Menu Item 3</Link>
        <Link to={"/"}>Menu Item 3</Link>
        <Link to={"/"}>Menu Item 3</Link>
        <Link to={"/"}>Menu Item 3</Link>
        <Link to={"/"}>Menu Item 3</Link>
        <div style={{ flex: 1 }}></div>
        <Link to={"/"}>Menu Item 3</Link>
        <Link to={"/"}>Menu Item 3</Link>
      </nav>
      <section id={"content"}>
        <aside id="left-sidebar">
          <div className={"content"}>
            <label>
              <input type="checkbox" />
              &raquo;
            </label>
            <h2>Left sidebar</h2>
            <ul>
              <li>Lorem ipsum dolor.</li>
              <li>Commodi eveniet, laborum.</li>
              <li>Ipsum, odio officia!</li>
              <li>Ad, enim, quae!</li>
              <li>Corporis, ipsam, sint?</li>
              <li>Culpa, facere suscipit.</li>
              <li>Eveniet, in, reprehenderit!</li>
              <li>Dignissimos nesciunt, perferendis?</li>
              <li>Harum, placeat, ut?</li>
              <li>Consequuntur, maiores, similique.</li>
            </ul>
            <ul>
              <li>Lorem ipsum dolor.</li>
              <li>Commodi eveniet, laborum.</li>
              <li>Ipsum, odio officia!</li>
              <li>Ad, enim, quae!</li>
              <li>Corporis, ipsam, sint?</li>
              <li>Culpa, facere suscipit.</li>
              <li>Eveniet, in, reprehenderit!</li>
              <li>Dignissimos nesciunt, perferendis?</li>
              <li>Harum, placeat, ut?</li>
              <li>Consequuntur, maiores, similique.</li>
            </ul>
            <ul>
              <li>Lorem ipsum dolor.</li>
              <li>Commodi eveniet, laborum.</li>
              <li>Ipsum, odio officia!</li>
              <li>Ad, enim, quae!</li>
              <li>Corporis, ipsam, sint?</li>
              <li>Culpa, facere suscipit.</li>
              <li>Eveniet, in, reprehenderit!</li>
              <li>Dignissimos nesciunt, perferendis?</li>
              <li>Harum, placeat, ut?</li>
              <li>Consequuntur, maiores, similique.</li>
            </ul>
          </div>
        </aside>
        <main>I'm a map</main>
        <aside className="right-sidebar">
          <div className={"content"}>
            <label>
              <input type="checkbox" />
              &raquo;
            </label>
            <h2>Right sidebar</h2>
            <ul>
              <li>Lorem ipsum.</li>
              <li>Nostrum, possimus!</li>
              <li>Dolorem, laudantium.</li>
              <li>Delectus, soluta?</li>
              <li>Itaque, repellat!</li>
              <li>Adipisci, doloribus.</li>
              <li>Inventore, magni.</li>
              <li>Blanditiis, minus!</li>
              <li>Distinctio, quidem?</li>
              <li>Natus, sequi?</li>
              <li>Laboriosam, voluptatum?</li>
              <li>Aliquam, blanditiis.</li>
              <li>Est, necessitatibus!</li>
              <li>Ex, odio.</li>
              <li>Provident, veritatis.</li>
              <li>Lorem ipsum.</li>
              <li>Nostrum, possimus!</li>
              <li>Dolorem, laudantium.</li>
              <li>Delectus, soluta?</li>
              <li>Itaque, repellat!</li>
              <li>Adipisci, doloribus.</li>
              <li>Inventore, magni.</li>
              <li>Blanditiis, minus!</li>
              <li>Distinctio, quidem?</li>
              <li>Natus, sequi?</li>
              <li>Laboriosam, voluptatum?</li>
              <li>Aliquam, blanditiis.</li>
              <li>Est, necessitatibus!</li>
              <li>Ex, odio.</li>
              <li>Provident, veritatis.</li>
              <li>Lorem ipsum.</li>
              <li>Nostrum, possimus!</li>
              <li>Dolorem, laudantium.</li>
              <li>Delectus, soluta?</li>
              <li>Itaque, repellat!</li>
              <li>Adipisci, doloribus.</li>
              <li>Inventore, magni.</li>
              <li>Blanditiis, minus!</li>
              <li>Distinctio, quidem?</li>
              <li>Natus, sequi?</li>
              <li>Laboriosam, voluptatum?</li>
              <li>Aliquam, blanditiis.</li>
              <li>Est, necessitatibus!</li>
              <li>Ex, odio.</li>
              <li>Provident, veritatis.</li>
            </ul>
          </div>
        </aside>
      </section>
      <footer>
        <div>Focus:</div>
        <div className={"divider"}></div>
        <div>Status</div>
      </footer>
    </>
  );
}
