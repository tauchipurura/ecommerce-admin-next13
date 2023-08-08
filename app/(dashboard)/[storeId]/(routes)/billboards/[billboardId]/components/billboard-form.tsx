"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Billboard } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard | null;
};

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit billboard' : 'Create billboard';
  const description = initialData ? 'Edit a billboard.' : 'Add a new billboard';
  const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this billboard first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []} 
                      disabled={loading} 
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Billboard label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};


// "use client"

// import * as z from "zod"
// import axios from "axios"
// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { toast } from "react-hot-toast"
// import { Trash } from "lucide-react"
// import { Billboard } from "@prisma/client"
// import { useParams, useRouter } from "next/navigation"

// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Separator } from "@/components/ui/separator"
// import { Heading } from "@/components/ui/heading"
// import { AlertModal } from "@/components/modals/alert-modal"
// import ImageUpload from "@/components/ui/image-upload"

// const formSchema = z.object({
//   label: z.string().min(1),
//   imageUrl: z.string().min(1),
// });

// type BillboardFormValues = z.infer<typeof formSchema>

// interface BillboardFormProps {
//   initialData: Billboard | null;
// };

// export const BillboardForm: React.FC<BillboardFormProps> = ({
//   initialData
// }) => {
//   const params = useParams();
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const title = initialData ? 'Edit billboard' : 'Create billboard';
//   const description = initialData ? 'Edit a billboard.' : 'Add a new billboard';
//   const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.';
//   const action = initialData ? 'Save changes' : 'Create';

//   const form = useForm<BillboardFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData || {
//       label: '',
//       imageUrl: ''
//     }
//   });

//   const onSubmit = async (data: BillboardFormValues) => {
//     try {
//       setLoading(true);
//       if (initialData) {
//         await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
//       } else {
//         await axios.post(`/api/${params.storeId}/billboards`, data);
//       }
//       router.refresh();
//       router.push(`/${params.storeId}/billboards`);
//       toast.success(toastMessage);
//     } catch (error: any) {
//       toast.error('Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setLoading(true);
//       await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
//       router.refresh();
//       router.push(`/${params.storeId}/billboards`);
//       toast.success('Billboard deleted.');
//     } catch (error: any) {
//       toast.error('Make sure you removed all categories using this billboard first.');
//     } finally {
//       setLoading(false);
//       setOpen(false);
//     }
//   }

//   return (
//     <>
//     <AlertModal 
//       isOpen={open} 
//       onClose={() => setOpen(false)}
//       onConfirm={onDelete}
//       loading={loading}
//     />
//      <div className="flex items-center justify-between">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button
//             disabled={loading}
//             variant="destructive"
//             size="sm"
//             onClick={() => setOpen(true)}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
//           <FormField
//               control={form.control}
//               name="imageUrl"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Background image</FormLabel>
//                   <FormControl>
//                     <ImageUpload 
//                       value={field.value ? [field.value] : []} 
//                       disabled={loading} 
//                       onChange={(url) => field.onChange(url)}
//                       onRemove={() => field.onChange('')}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           <div className="md:grid md:grid-cols-3 gap-8">
//             <FormField
//               control={form.control}
//               name="label"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Label</FormLabel>
//                   <FormControl>
//                     <Input disabled={loading} placeholder="Billboard label" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <Button disabled={loading} className="ml-auto" type="submit">
//             {action}
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// };


// "use client"

// import * as z from "zod";
// import axios from 'axios';
// import { Button } from "@/components/ui/button";
// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// import { Billboard } from "@prisma/client"
// import { Trash } from "lucide-react";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "react-hot-toast";
// import { useParams, useRouter } from "next/navigation";
// import { AlertModal } from "@/components/modals/alert-modal";
// import { useOrigin } from "@/hooks/use-origin";
// import ImageUpload from "@/components/ui/image-upload";

// const formSchema = z.object({
//     label: z.string().min(1),
//     imageUrl : z.string().min(1),
// });

// type BillboardFormValues = z.infer<typeof formSchema>;

// interface BillboardFormProps {
//     initialData: Billboard | null;

// }

// export const BillboardForm: React.FC<BillboardFormProps> = ({
//     initialData
// }) => {

//     const params = useParams();
//     const router = useRouter();

//     const [open , setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const title = initialData ? "Edit billboard" : "Create billboard";
//     const description = initialData ? "Edit a billboard" : "Add a new billboard";
//     const toastMessage = initialData ? "billboard updated" : "Create billboard";
//     const action = initialData ? "Save changes" : "Create";

//     const form = useForm<BillboardFormValues>({
//         resolver: zodResolver(formSchema),
//         defaultValues: initialData || {
//             label: '',
//             imageUrl: '',
//         }
//     });

//     const onSubmit = async (data: BillboardFormValues) => {
//         try {
//         setLoading(true);
//         if (initialData) {
//             await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
//         } else {
//             await axios.post(`/api/${params.storeId}/billboards`, data);
//         }
//         router.refresh();
//         router.push(`/${params.storeId}/billboards`);
//         toast.success(toastMessage);
//         } catch (error: any) {
//         toast.error('Something went wrong.');
//         } finally {
//         setLoading(false);
//         }
//     };

//     const onDelete = async () => {
//         try {
//             setLoading(true)
//             await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
//             router.refresh();
//             router.push("/")
//             toast.success("Billboard deleted.")
//         } catch (error) {
//             toast.error("Make sure you remeoved all categories using this billboard first ")
//         }finally{
//             setLoading(false)
//             setOpen(false)
//         }
//     }

//     return (
//         <>
//             <AlertModal
//                 isOpen={open}
//                 onClose={() => setOpen(false)}
//                 onConfirm={onDelete}
//                 loading={loading}
//             />
//             <div className="flex items-center justify-between">
//                 <Heading
//                     title= {title}
//                     description = {description}
//                 />
//                 { initialData && (
//                 <Button
//                 disabled={loading}
//                     variant="destructive"
//                     size="sm"
//                     onClick={()=> setOpen(true)}
//                 >
//                     <Trash className="h-4 w-4"/>
//                 </Button>
//                 )}
//             </div>
//             <Separator/>
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
//                 <FormField
//                     control={form.control}
//                     name="imageUrl"
//                     render={({field}) => (
//                         <FormItem>
//                             <FormLabel>Background Image</FormLabel>
//                             <FormControl>
//                                 <ImageUpload
//                                     value={field.value ? [field.value] : []}
//                                     disabled={loading}
//                                     onChange={(url) => field.onChange(url)}
//                                     onRemove={()=> field.onChange("")}
//                                 />
//                             </FormControl>
//                             <FormMessage/>
//                         </FormItem>
//                     )}
//                 />
//                     <div className="grid grid-cols-3 gap-3">
//                         <FormField
//                             control={form.control}
//                             name="label"
//                             render={({field}) => (
//                                 <FormItem>
//                                     <FormLabel>Label</FormLabel>
//                                     <FormControl>
//                                         <Input disabled={loading} placeholder="Billboard label" {...field}/>
//                                     </FormControl>
//                                     <FormMessage/>
//                                 </FormItem>
//                             )}
//                         />
//                     </div>
//                     <Button disabled={loading} className="ml-auto" type="submit">
//                         {action}
//                     </Button>
//                 </form>
//             </Form>
//             <Separator/>
//         </>
//     )
// }