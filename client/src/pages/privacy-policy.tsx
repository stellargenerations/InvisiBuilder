import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Invisibuilder</title>
        <meta name="description" content="Invisibuilder's privacy policy outlines how we collect, use, and protect your personal information. We prioritize your privacy and data security." />
      </Helmet>
      
      <div className="py-12 bg-gradient-to-b from-neutral-200 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold text-neutral-900">Privacy Policy</h1>
            <p className="mt-4 text-lg text-neutral-800 max-w-3xl mx-auto">
              Last updated: May 15, 2023
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p>
              At Invisibuilder, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and services, participate in activities on the Website, or otherwise contact us.
            </p>
            
            <p>
              The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make, and the products and features you use. The personal information we collect may include the following:
            </p>
            
            <ul>
              <li><strong>Personal Information</strong>: Name, email address, and other contact data.</li>
              <li><strong>Credentials</strong>: Passwords and similar security information used for authentication and account access.</li>
              <li><strong>Payment Data</strong>: If you make purchases, we may collect data necessary to process your payment, such as payment instrument number and the security code associated with your payment instrument.</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect or receive:
            </p>
            
            <ul>
              <li>To facilitate account creation and authentication and otherwise manage user accounts.</li>
              <li>To deliver services to you and fulfill our contractual obligations.</li>
              <li>To send you marketing and promotional communications if you have opted in to receive them.</li>
              <li>To respond to user inquiries and offer support to users.</li>
              <li>To improve our website and services.</li>
              <li>To comply with our legal obligations.</li>
              <li>To protect our rights or interests, or those of third parties.</li>
            </ul>
            
            <h2>Third-Party Websites</h2>
            <p>
              Our website may contain links to other websites that are not under our direct control. These websites may have their own privacy policies and terms of service. We are not responsible for the privacy practices or content of any linked websites. We encourage you to review the privacy policy of any website you visit.
            </p>
            
            <h2>Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
            </p>
            
            <h2>Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk.
            </p>
            
            <h2>Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            
            <ul>
              <li>The right to access information we have about you.</li>
              <li>The right to request that we correct or update any personal information we have about you.</li>
              <li>The right to request deletion of your personal information.</li>
              <li>The right to opt-out of marketing communications.</li>
            </ul>
            
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
            
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect and use personal information about you. For more information about the types of cookies we use, why, and how you can control them, please see our Cookie Policy.
            </p>
            
            <h2>Children's Privacy</h2>
            <p>
              Our Website is not intended for individuals under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            
            <p>
              Email: <a href="mailto:privacy@invisibuilder.com" className="text-primary-dark hover:text-primary">privacy@invisibuilder.com</a><br />
              Address: 123 Privacy Way, Suite 456, Anonymity, AN 12345<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
