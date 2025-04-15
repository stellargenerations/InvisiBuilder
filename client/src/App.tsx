import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Article from "@/pages/content/article";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import PrivacyPolicy from "@/pages/privacy-policy";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/articles" component={Articles} />
          <Route path="/contact" component={Contact} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/:slug" component={Article} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
