# Setting Up Sanity Studio in Replit

To use Sanity Studio with tables within Replit, you need to run Sanity Studio in a separate terminal window while keeping your main application running.

## Starting Sanity Studio

1. Open a new Shell/Console tab in Replit by clicking the "+" icon in the console pane
2. Run the following command:

```bash
cd sanity && npx sanity dev --host=0.0.0.0 --port=3333
```

3. Once Sanity Studio is running, you can access it at: http://0.0.0.0:3333/

## Using Tables in Sanity Studio

1. Log into Sanity Studio with your credentials
2. Navigate to "Content" and select an article to edit (or create a new one)
3. In the Content field, you should see a toolbar with various formatting options
4. Look for the table icon in the toolbar (it may be in a dropdown menu)
5. When you click the table icon, you'll be prompted to set rows and columns
6. After creating the table, you can add content to each cell

## Troubleshooting

- If you don't see the table option, ensure the table plugin is included in your schema (it is!)
- Make sure you're editing a rich text field that supports tables

## After Creating Tables

Once you've created and saved tables in your Sanity content, they'll be rendered on your website using the custom SanityTable component we've created.